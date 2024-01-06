from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4

class User(BaseModel):
    id: int = Field(default_factory=lambda: uuid4().int)
    Username: str
    Password: str
    Status: str = Field(default="Online")


class Message(BaseModel):
    id: int = Field(default_factory=lambda: uuid4().int)
    data: str
    SenderID: int
    TimeStamp: datetime = Field(..., format="YYYY-MM-DD HH:MM:SS")

class Session(BaseModel):
    id: int = Field(default_factory=lambda: uuid4().int)
    UserID1: dict
    UserID2: dict