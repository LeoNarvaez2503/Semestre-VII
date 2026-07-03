from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    PORT: int = 8001
    USUARIOS_API_URL: str = "http://usuarios-api:8000"
    VEHICULOS_API_URL: str = "http://vehiculos-app:3000"
    ZONAS_API_URL: str = "http://zonas-app:8080"
    ASIGNACIONES_API_URL: str = "http://asignacion-app:3001"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
