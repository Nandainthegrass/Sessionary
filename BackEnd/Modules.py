from fastapi import Response, WebSocket
import json
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from models import User
from database import Users, Sessions, Messages, Requests
from nanoid import generate

'''
TOKEN DETAILS AND SECRET_KEY TO ENCRYPT OUR TOKENS
'''
SECRET_KEY = "35fd6282e2e929ad65cb27564ee7dd71884928de60a516573eb6cd1bbdac9ec6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

'''
OBJECT THAT STORES ALGORTHIMS FOR THE PASSWORD HASHING AND VERIFICATION
'''
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

'''
FUNCTION TO SEARCH USER BY USERNAME FROM THE DATABASE
'''
async def search_user_by_username(Username):
    user = await Users.find_one({"Username": Username})
    return user

'''
CREATES A NEW USER AND STORES IT IN THE DATABASE
'''
async def create_user(user: User):
    id = generate(size=8)   
    await Users.insert_one({
        "id": id,
        "Username": user.username,
        "Password": pwd_context.hash(user.password),
        "Status": "Offline"
    })

'''
FUNCTION TO CREATE ACCESS TOKEN AND STORE THE USERID WITHIN THE TOKEN
'''
def create_access_token(UserID: str):
    token_data = {"sub": UserID}
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode = {"exp": expire, **token_data}
    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token


'''
FUNCTION TO VALIDATE THE TOKEN BY CHECKING IF THE USERID STORED IN THE TOKEN IS THE SAME AS,
THE USERID THAT SENT US THIS TOKEN
'''
def validate_access_token(UserID: str, token):
    if token is None:
        return Response(status_code=400)
    else:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get('sub')
            if user_id != UserID:
                return Response(status_code=400)
        except JWTError:
            return Response(status_code=401)

'''
FUNCTION TO VERIFY IF THE ENTERED PASSWORD IS SAME AS THE PASSWORD HASHED IN OUR DATABASE
'''
def Verify_Password(Password, hashed_password):
    return pwd_context.verify(Password, hashed_password)


'''
FUNCTION TO LOAD ALL THE CHATS AND SESSIONS THAT THE USER IS INVOLVED IN, INITIATED AT THE TIME OF LOGGING IN
'''
async def Load_User_Session_Details(UserID: str):
    content = { "type": "Sessions",
        "Sessions": []}
    sessions = await Sessions.find({"Users": UserID}, {"SessionID": 1, "Users": 1}).to_list(length=None)
    if sessions != None:
        for session in sessions:
            for user in session.get('Users', []):
                if user != UserID:
                    user_details = await Users.find_one({"id": user}, {"Username": 1})
                    content["Sessions"].append({ "SessionID": session['SessionID'], "Username": user_details["Username"]})
    return content


'''
A CLASS THAT MANAGES ALL THE CONNECTIONS ON THE WEBSOCKET AND HOW MESSAGES ARE SENT ON THE WEBSOCKET
'''
class Connection_Manager:
    def __init__(self):
        self.connections: dict = {}
    async def connect(self, UserID: str, websocket: WebSocket):
        result = await Users.update_one({"id": UserID}, {"$set":{"Status": "Online"}})
        await websocket.accept()
        self.connections[UserID] = websocket
    async def Send_Message(self, UserID: str, message):
        if UserID in self.connections:
            socket = self.connections[UserID]
            await socket.send_text(message)
    async def disconnect(self, UserID: str):
        del self.connections[UserID]
        result = await Users.update_one({"id": UserID}, {"$set":{"Status": "Offline"}})
    async def broadcast(self, message):
        for connection in self.connections.values():
            await connection.send_text(message)

'''
FUNCTION TO CHECK IF SESSION ALREADY EXISTS
'''
async def Session_Exists(UserID1, UserID2):
    check1 = await Sessions.find_one({"Users": [UserID1, UserID2]})
    check2 = await Sessions.find_one({"Users": [UserID2, UserID1]})

    if check1 == None and check2 == None:
        return False
    else:
        return True 
'''
FUNCTION TO FIND ALL THE REQUESTS BELONGING TO A USER
'''
async def Send_Pending_Requests(Manager, UserID):
    requests = await Requests.find_one({"UserID": UserID})
    if requests == None:
        content_list = []
    else:
        content_list = requests['Username']
    content = {
        "type": "pending requests",
        "Username": content_list
    }
    await Manager.Send_Message(UserID, json.dumps(content))
'''
FUNCTION TO SEE IF USER HAS ALREADY SENT A REQUEST TO THIS USER BEFORE
'''
async def Check_Requests(UserID, Username):
    check = await Requests.find_one({"UserID": UserID, "Username": Username})
    if check:
        return True
    else:
        return False

'''
FUNCTION THAT HANDLES THE REQUEST TO SEARCH FOR A PARTICULAR USER,
BY BREAKING DOWN AND PROCESSING THE REQUEST SENT ON THE WEBSOCKET
'''
async def Search_User(Manager, data, UserID: str):
    searched_user = await search_user_by_username(data['username'])
    if searched_user is None:
        reply = {
            "type": "Error",
            "Details": "User Not Found"
        }
        await Manager.Send_Message(UserID, json.dumps(reply))
    elif searched_user['id'] == UserID:
        reply = {
            "type": "Error",
            "Details": "Cannot Talk To Yourself"
        }
        await Manager.Send_Message(UserID, json.dumps(reply))
    elif await Session_Exists(UserID, searched_user['id']):
        reply = {
            "type": "Error",
            "Details": "Session already exists"
        }
        await Manager.Send_Message(UserID, json.dumps(reply))
    else:
        user = await Users.find_one({"id": UserID}, {"Username": 1})
        if await Check_Requests(searched_user['id'], user["Username"]):
            reply = {
                "type": "Error",
                "Details": "Request already sent!"
            }
            await Manager.Send_Message(UserID, json.dumps(reply))
        else:
            result = await Requests.find_one({"UserID": searched_user['id']})
            if result == None:
                await Requests.insert_one({
                    "UserID": searched_user['id'],
                    "Username": [user['Username']]
                })
            else:
                requests = result['Username']
                requests.append(user['Username'])
                result = await Requests.update_one({"UserID": searched_user['id']}, {"$set": {"Username": requests}})
            
'''
FUNCTION HANDLES THE REQUEST TO ESTABLISH A SESSION
AND CREATES A SESSION IF THE REQUEST IS ACCEPTED
AND REMOVES THE REQUEST FROM THE REQUESTS DATABASE
'''
async def Request_User(Manager, data, UserID: str):
    reciever = await search_user_by_username(data['username'])
    sender = await Users.find_one({'id': UserID})
    if data["Accepted"] == 0:
        if reciever['Status'] == "Online":
            reply = {
                "type": "Error",
                "Details": f"{sender['Username']} has rejected your request!"
            }
            await Manager.Send_Message(reciever['id'], message = json.dumps(reply))
    else:
        if await Session_Exists(sender['id'], reciever['id']):
            reply = {
                "type": "Error",
                "Details": "Cannot accept Multiple times"
            }
            await Manager.Send_Message(UserID, message = json.dumps(reply))
        else:
            id = generate(size=10)
            await Sessions.insert_one({
                "SessionID": id,
                "Users": [sender['id'], reciever['id']]
            })
            sender_reply = {
                "type": "Session",
                "Session": {
                    "SessionID": id,
                    "Username" : reciever['Username'],
                    "color" : "None"
                }
            }
            await Manager.Send_Message(sender['id'], message = json.dumps(sender_reply))
            reciever_reply = {
                "type": "Session",
                "Session": {
                    "SessionID": id,
                    "Username" : sender['Username'],
                    "Color": "None"
                }
            }
            await Manager.Send_Message(reciever['id'], message = json.dumps(reciever_reply))
    requests = await Requests.find_one({"UserID": UserID})
    request = requests["Username"]
    request.remove(data['username'])
    await Requests.update_one({"UserID": UserID}, {"$set": {"Username": request}})


'''
FUNCTION TO HANDLE MESSAGES THAT SENT IN A PARTICULAR SESSION,
STORING IT AND SEND IT OUT TO ALL USERS IN THAT SESSION,
INCLUDING THE CLIENT THAT SENT IT AS WELL
'''
async def Message_Handler(Manager, data, UserID:str):
    user = await Users.find_one({"id": UserID})
    id = generate(size=12)
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    await Messages.insert_one({
        "MessageID": id,
        "SessionID": data['SessionID'],
        "Data": data['data'],
        "TimeStamp": time,
        "SenderID": user["Username"]
    })
    Sesh = await Sessions.find_one({"SessionID": data["SessionID"]})
    Message = {
        "type": "message",
        "SessionID": data['SessionID'],
        "Message":{
            "Data": data['data'],
            'TimeStamp': time,
            'Sender': user['Username']
        }
    }
    for user in Sesh['Users']:
        await Manager.Send_Message(user, message = json.dumps(Message))


'''
FUNCTION TO LOAD ALL SESSION MESSAGES ON CLICK OF SESSION BUTTON
'''

async def load_messages(Manager, UserID, SessionID):
    messages = await Messages.find({"SessionID": SessionID}).sort({"TimeStamp": 1}).to_list(length=None)
    if messages is None:
        reply = {
        "type": "load messages",
        "Session":SessionID,
        "Messages": []
    }
    else:
        reply = {
            "type": "load messages",
            "SessionID":SessionID,
            "Messages": [{"Data": message['Data'], "TimeStamp": message['TimeStamp'], "Sender": message["SenderID"]} for message in messages]
        }
    await Manager.Send_Message(UserID, json.dumps(reply))


'''
FUNCTION TO LOAD USER SESSION DETAILS
'''
async def load_sessions(Manager, UserID):
    reply = Load_User_Session_Details(UserID=UserID)
    await Manager.Send_Message(UserID, json.dumps(reply))

'''
FUNCTION TO DELETE A SESSIONS FROM THE DB
'''
async def delete_session(Manager,UserID, SessionID):
    check = await Sessions.find_one({"SessionID": SessionID})
    if check is None:
        reply = {
            "type": "Error",
            "Details": "Session doesn't exist or has been deleted already"
        }
    else:
        await Messages.delete_many({"SessionID": SessionID})
        await Sessions.delete_one({"SessionID": SessionID})
        reply = {
            "type": "Error",
            "Details": "A Session has been deleted by you or your friend"
        }
        for user in check["Users"]:
            await Manager.Send_Message(user, json.dumps(reply))
        