from fastapi import FastAPI, Response, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import json
from fastapi.middleware.cors import CORSMiddleware
from models import User
from Modules import *

app = FastAPI()

origins = [
    "http://localhost:5173",
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

@app.get('/ping')
def ping():
    return {"message": "pong"}

@app.post('/register_user/')
async def register_user(user: User):
    check = await search_user_by_username(user.username)
    if check == None: 
        await create_user(user=user)
        return Response(status_code=200)
    else:
        return Response(status_code=409)#Username taken


@app.post('/Login/')
async def login_user(user:User):
    check = await search_user_by_username(user.username)
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

@app.get('/Load_Details/{UserID}')
async def Load_Details(UserID: str, token: str = None):
    validate_access_token(UserID=UserID, token=token)
    content = await Load_User_Session_Details(UserID=UserID)
    return JSONResponse(content=content)

Manager = Connection_Manager()

@app.websocket("/connection/{UserID}")
async def connection(UserID: str, websocket: WebSocket, token: str = None):
    validate_access_token(UserID=UserID, token=token)
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
                await Message_Handler(Manager=Manager, data=data, UserID=UserID)
            elif data['type'] == "pending requests":
                await Send_Pending_Requests(Manager=Manager, UserID=UserID)
            elif data['type'] == "load sessions":
                await load_sessions(Manager=Manager, UserID=UserID)
            elif data['type'] == "load messages":
                await load_messages(Manager=Manager, UserID=UserID, SessionID=data["SessionID"])
            elif data['type'] == "delete":
                await delete_session(Manager=Manager, UserID=UserID, SessionID=data["SessionID"])
                
    except WebSocketDisconnect:
        print(f"Websocket Disconnect for User: {UserID}")
        await Manager.disconnect(UserID=UserID)
