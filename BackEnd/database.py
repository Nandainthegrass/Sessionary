import motor.motor_asyncio

MONGO_DETAILS = "mongodb://localhost:27017"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client["Sessionary"]


Users = database["Users"]
Messages = database["Messages"]
Sessions = database["Sessions"]