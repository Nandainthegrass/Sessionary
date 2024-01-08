from fastapi import FastAPI, Response
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import User, Message, Session
from database import Users, Messages, Sessions

app = FastAPI()

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.post('/register_user/')
def register_user(user: User):
    content = {"UserID": "1234", "UserName":user.Username}
    return Response(content = json.dumps(content), status_code=200, headers={
        'Content-Type': 'application/json'
    })

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