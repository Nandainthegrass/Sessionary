from fastapi import FastAPI

app = FastAPI()

@app.get('/{Number}')
def home(Number):
    return {"Hello": Number}

#Winston You Suck