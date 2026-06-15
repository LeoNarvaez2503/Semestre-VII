from fastapi import FastAPI
from src.db import init_db
from src.routers import user_router

app = FastAPI(title="Usuarios-Roles SOLID - FastAPI")


@app.on_event("startup")
def on_startup():
    # create tables if not exist (for demo / sqlite)
    init_db()


app.include_router(user_router.router, prefix="/users", tags=["users"]) 
