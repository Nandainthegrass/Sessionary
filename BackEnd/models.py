from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4

class User(BaseModel):
    username: str
    password: str


class Message(BaseModel):
    data: str
    SenderID: int
    TimeStamp: datetime = Field(..., format="YYYY-MM-DD HH:MM:SS")

class Session(BaseModel):
    UserID1: dict
    UserID2: dict