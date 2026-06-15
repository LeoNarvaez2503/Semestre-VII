import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Use DATABASE_URL from environment; fallback to sqlite for quick demo
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./usuarios_roles.db")

# create engine with minimal config; psycopg2 for postgres if used
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    # import models to ensure they are registered with SQLAlchemy metadata
    from src import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
