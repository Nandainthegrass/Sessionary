import motor.motor_asyncio
import os

database_url = os.getenv("DATABASE_URL")

MONGO_DETAILS = database_url

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client["Sessionary"]


Users = database["Users"]
Messages = database["Messages"]
Sessions = database["Sessions"]
Requests = database["Requests"]