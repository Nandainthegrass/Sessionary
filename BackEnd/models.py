from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4

class User(BaseModel):
    username: str
    password: str

