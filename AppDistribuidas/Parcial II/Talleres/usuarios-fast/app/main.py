from fastapi import FastAPI
from app.api import users
from app.core.database import engine, Base


def create_app() -> FastAPI:
    # create DB tables if not exist (for development)
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="Usuarios API")
    app.include_router(users.router)
    return app


app = create_app()
