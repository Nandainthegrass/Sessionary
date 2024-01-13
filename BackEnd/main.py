from fastapi import FastAPI, Response, WebSocket, Depends, HTTPException
from fastapi.responses import JSONResponse
import json
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from jose import JWTError, jwt
from models import User, Message, Session
from database import Users, Sessions, Messages
from nanoid import generate

app = FastAPI()

SECRET_KEY = "35fd6282e2e929ad65cb27564ee7dd71884928de60a516573eb6cd1bbdac9ec6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

origins = [
    "http://localhost:5173",
    "mongodb://localhost:27017",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
    expose_headers = ["*"]
)

@app.post('/register_user/')
async def register_user(user: User):
    check = await Users.find_one({"Username":f"{user.username}"})
    if check == None: 
        id = generate(size=8)   
        await Users.insert_one({
            "id": id,
            "Username": user.username,
            "Password": pwd_context.hash(user.password),
            "Status": "Offline"
        })
        return Response(status_code=200)
    else:
        return Response(status_code=409)#Username taken

def create_access_token(UserID: str):
    token_data = {"sub": UserID}
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode = {"exp": expire, **token_data}
    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token

@app.get('/test/{UserID}')
async def testdb(UserID: str):
    pipeline = [
        {"$match": {"id": UserID}},
        {"$lookup": {"from": "Sessions", "localField": "id", "foreignField": "Users", "as": "userSessions"}},
        {"$unwind": "$userSessions"},
        {"$lookup": {"from": "Messages", "localField": "userSessions.SessionID", "foreignField": "SessionID", "as": "sessionMessages"}},
        {"$lookup": {"from": "Users", "localField": "userSessions.Users", "foreignField": "id", "as": "sessionUsers"}},
        {"$group": {
            "_id": "$userSessions.SessionID",
            "UserIds": {"$addToSet": {"UserID": "$sessionUsers.id", "Name": "$sessionUsers.Username"}},
            "Messages": {
                "$push": {
                    "MessageID": "$sessionMessages.MessageID",
                    "Data": "$sessionMessages.Data",
                    "TimeStamp": "$sessionMessages.TimeStamp",
                    "SenderID": "$sessionMessages.SenderID"
                }
            }
        }},
        {"$project": {
            "_id": 0,
            "SessionId": "$_id",
            "UserIds": 1,
            "Messages": 1
        }}
    ]  
    content = await Users.aggregate(pipeline=pipeline).to_list(length=None)
    print(content)
    return JSONResponse(content={"content": content})

@app.post('/Login/')
async def login_user(user:User):
    check = await Users.find_one({"Username":f"{user.username}"})
    if check == None:
        return Response(status_code=400)#User Doesn't Exist/ Invalid User
    else:
        if pwd_context.verify(user.password, check['Password']):
            jwt_token = create_access_token(check['id'])

            content = {"UserID": check['id'], "Username":check['Username']}
            return Response(content = json.dumps(content), status_code=200, headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {jwt_token}'
            })
        else:
            return Response(status_code=401)#Password doesn't match

@app.websocket("/connection/{UserID}")
async def connection(UserID: str, websocket: WebSocket, token: str = None):
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
    
    await websocket.accept()
    try:
        while True:
            content = await websocket.receive_json()
            data = json.loads(content)

            await websocket.send_json(json.dumps(data))
    except:
        print("Error")