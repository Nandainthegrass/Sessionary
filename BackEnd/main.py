from fastapi import FastAPI, Response, WebSocket
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import User, Message, Session
from database import Users
from nanoid import generate

app = FastAPI()

origins = [
    "http://localhost:5173",
    "mongodb://localhost:27017",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.post('/register_user/')
async def register_user(user: User):
    check = await Users.find_one({"Username":f"{user.username}"})
    if check == None: 
        id = generate(size=8)   
        await Users.insert_one({
            "id": id,
            "Username": user.username,
            "Password": user.password,
            "Status": "Online"
        })
        content = {"UserID": id, "Username":user.username}
        return Response(status_code=200)
    else:
        return Response(status_code=409)#Username taken
    
@app.post('/Login/')
async def login_user(user:User):
    check = await Users.find_one({"Username":f"{user.username}"})
    if check == None:
        return Response(status_code=400)#User Doesn't Exist/ Invalid User
    else:
        if user.password == check['Password']:
            content = {"UserID": check['id'], "Username":check['Username']}
            return Response(content = json.dumps(content), status_code=200, headers={
            'Content-Type': 'application/json'
            })
        else:
            return Response(status_code=401)#Password doesn't match

@app.websocket("/connection/{UserID}")
async def connection(UserID: str, websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message: {data}")