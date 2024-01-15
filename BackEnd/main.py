from fastapi import FastAPI, Response, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import json
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from jose import JWTError, jwt
from models import User, Message, Session
from database import Users, Sessions, Messages
from functions import *

app = FastAPI()

origins = [
    "http://localhost:5173",
    "mongodb://localhost:27017",
    "http://192.168.29.40:5173",
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
        await create_user(user)
        return Response(status_code=200)
    else:
        return Response(status_code=409)#Username taken


@app.get('/Load_Details/{UserID}')
async def Load_Details(UserID: str, token: str = None):
    validate_access_token(UserID, token)
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
        if Verify_Password(user.password, check['Password']):
            jwt_token = create_access_token(check['id'])

            content = {"UserID": check['id'], "Username":check['Username']}
            return Response(content = json.dumps(content), status_code=200, headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {jwt_token}'
            })
        else:
            return Response(status_code=401)#Password doesn't match


Manager = Connection_Manager()
@app.websocket("/connection/{UserID}")
async def connection(UserID: str, websocket: WebSocket, token: str = None):
    validate_access_token(UserID, token)
    await Manager.connect(UserID=UserID, websocket=websocket)
    try:
        while True:
            content = await websocket.receive_text()
            data = json.loads(content)
            if data['type'] == "search":
                await Search_User(Manager=Manager, data=data, UserID=UserID)
            elif data['type'] == "request":
                await Request_User(Manager=Manager, data=data, UserID=UserID)
            elif data['type'] == "message":
                pass

    except WebSocketDisconnect:
        print(f"Websocket Disconnect for User: {UserID}")
        await Manager.disconnect(UserID=UserID)
