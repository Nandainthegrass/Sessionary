from fastapi import Response
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from models import User, Message, Session
from database import Users, Sessions, Messages
from nanoid import generate


SECRET_KEY = "35fd6282e2e929ad65cb27564ee7dd71884928de60a516573eb6cd1bbdac9ec6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user(user: User):
    id = generate(size=8)   
    await Users.insert_one({
        "id": id,
        "Username": user.username,
        "Password": pwd_context.hash(user.password),
        "Status": "Offline"
    })

def create_access_token(UserID: str):
    token_data = {"sub": UserID}
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode = {"exp": expire, **token_data}
    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token

def validate_access_token(UserID: str, token):
    if token is None:
        return Response(status_code=400, detail="User Token Missing")
    else:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get('sub')
            if user_id != UserID:
                return Response(status_code=400, detail='Invalid User, Access Denied!')
        except JWTError:
            return Response(status_code=401, detail='Invalid Credentials')

def Verify_Password(Password, hashed_password):
    return pwd_context.verify(Password, hashed_password)

class Connection_Manager:
    def __init__(self):
        self.connections: dict = {}
    async def connect(self, UserID: str, websocket: WebSocket):
        result = await Users.update_one({"id": UserID}, {"$set":{"Status": "Online"}})
        await websocket.accept()
        self.connections[UserID] = websocket
    async def Send_Message(self, UserID: str, message):
        socket = self.connections[UserID]
        await socket.send_text(message)
    async def disconnect(self, UserID: str):
        del self.connections[UserID]
        result = await Users.update_one({"id": UserID}, {"$set":{"Status": "Offline"}})
    async def broadcast(self, message):
        for connection in self.connections.values():
            await connection.send_text(message)


async def Search_User(Manager, data, UserID: str):
    check = await Users.find_one({"Username": data['username']})
    if check is None:
        reply = {
            "type": "Error",
            "Details": "User Not Found"
        }
        await Manager.Send_Message(UserID, json.dumps(reply))
    else:
        if check['Status'] == "Offline":
            reply = {
                "type": "Error",
                "Details": "User isn't Online"
            }
            await Manager.Send_Message(UserID, json.dumps(reply))
        else:
            Person = await Users.find_one({"id": UserID}, {"Username": 1})
            message = {
                "type": "search",
                "Username": Person["Username"]
            }
            await Manager.Send_Message(check['id'], message=json.dumps(message))

async def Request_User(Manager, data, UserID: str):
    reciever = await Users.find_one({"Username": data['Username']})
    sender = await Users.find_one({'id': UserID})
    if data["Accepted"] == 0:
        if reciever['Status'] == "Online":
            reply = {
                "type": "Request",
                "Response": f"{sender['Username']} has rejected your request!"
            }
            await Manager.Send_Message(reciever['id'], message = json.dumps(reply))
    else:
        id = generate()
        await Sessions.insert_one({
            "SessionID": id,
            "Users": [sender['id'], reciever['id']]
        })
        sender_reply = {
            "type": "Session",
            "SessionID": id,
            "Users": {
                reciever['id']: reciever['Username']
            }
        }
        await Manager.Send_Message(sender['id'], message = json.dumps(sender_reply))
        reciever_reply = {
            "type": "Session",
            "SessionID": id,
            "Users": {
                sender['id']: sender['Username']
            }
        }
        await Manager.Send_Message(reciever['id'], message = json.dumps(reciever_reply))

async def Message_Handler(Manager, data, UserID:str):
    pass
