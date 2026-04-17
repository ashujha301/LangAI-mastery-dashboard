from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/langai_db"
    
    # Clerk
    CLERK_SECRET_KEY: str
    CLERK_FRONTEND_API: str
    
    # API
    API_HOST: str = "localhost"
    API_PORT: int = 8000
    API_ENV: str = "development"
    
    # LLM/LangChain
    OPENAI_API_KEY: str
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_API_KEY: str = ""
    
    # Security
    ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
