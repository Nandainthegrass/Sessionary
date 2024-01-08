from fastapi import FastAPI, Response
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import User, Message, Session
from database import Users, Messages, Sessions
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
        return Response(content = json.dumps(content), status_code=200, headers={
            'Content-Type': 'application/json'
        })
    else:
        return Response(status_code=269)

@app.post('/Login/')
async def login_user(user:User):
    check = await Users.find_one({"Username":f"{user.username}"})
    if check == None:
        return Response(status_code=220)#User Doesn't Exist/ Invalid User
    else:
        if user.password == check['Password']:
            content = {"UserID": check['id'], "Username":check['Username']}
            return Response(content = json.dumps(content), status_code=200, headers={
            'Content-Type': 'application/json'
            })
        else:
            return Response(status_code=225)#Password doesn't match

@app.get('/load_details/{session_id}')
def Load_Session_Details(session_id: int):
    return {
        session_id : {
            "UserX 1": "Message",
            "UserY 1": "Message",
            "UserX 2": "Message"
        }
    }

@app.post('/message_sent/{Session_id}')
def Send_Messages(Sessage_id: int, message: Message):
    return None

@app.get('/message_recieve/{Session_id}')
def Recieve_Messages(Session_id: int):
    return {
        "Message": "Data",
        "TimeStamp": "Time",
        "Sender": "Name"
    }