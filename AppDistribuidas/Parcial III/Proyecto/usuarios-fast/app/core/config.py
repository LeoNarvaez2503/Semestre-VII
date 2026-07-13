from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    PORT: int = 8000
    RABBITMQ_HOST: str = "rabbitmq"
    RABBITMQ_PORT: int = 5672
    RABBITMQ_USER: str = "guest"
    RABBITMQ_PASSWORD: str = "guest"
    RABBITMQ_EXCHANGE: str = "audit_exchange"
    RABBITMQ_ROUTING_KEY: str = "audit.#"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
