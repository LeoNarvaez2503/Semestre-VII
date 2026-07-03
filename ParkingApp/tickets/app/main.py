from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import tickets

# Auto-creación de tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Tickets (FastAPI)",
    description="Backend para la gestión de tickets de estacionamiento.",
    version="1.0.0",
    docs_url="/tickets/docs",
    openapi_url="/tickets/openapi.json"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router)

@app.get("/", tags=["General"])
def read_root():
    return {"message": "API de Tickets activa. Acceda a /docs para ver la documentación interactiva."}
