from fastapi import FastAPI, Response
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
class User(BaseModel):
    username: str
    password: str

class Message(BaseModel):
    data: str
    sender_id: int
    TimeStamp: str


@app.post('/register_user/')
def register_user(user: User):
    print(user.username)
    return Response(content={"UserID": 1234, "UserName":user.username}, status_code=200)

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