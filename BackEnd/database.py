import motor.motor_asyncio
from dotenv import dotenv_values

config = dotenv_values(".env")

database_url = config["DATABASE_URL"]

MONGO_DETAILS = database_url

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client["Sessionary"]


Users = database["Users"]
Messages = database["Messages"]
Sessions = database["Sessions"]
Requests = database["Requests"]