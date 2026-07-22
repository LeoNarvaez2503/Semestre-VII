from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Any

class Settings(BaseSettings):
    DATABASE_URL: str
    PORT: int = 8001
    USUARIOS_API_URL: str = "http://auth-service:8000"
    VEHICULOS_API_URL: str = "http://auth-service:8000"
    ZONAS_API_URL: str = "http://parking-service:8080"
    ASIGNACIONES_API_URL: str = "http://billing-service:3002"
    RABBITMQ_HOST: str = "rabbitmq"
    RABBITMQ_PORT: int = 5672
    RABBITMQ_USER: str = "guest"
    RABBITMQ_PASSWORD: str = "guest"
    RABBITMQ_EXCHANGE: str = "audit_exchange"
    RABBITMQ_ROUTING_KEY: str = "audit.#"

    @field_validator("RABBITMQ_PORT", mode="before")
    @classmethod
    def parse_rabbitmq_port(cls, v: Any) -> int:
        if isinstance(v, str) and ":" in v:
            return int(v.split(":")[-1])
        return int(v)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
