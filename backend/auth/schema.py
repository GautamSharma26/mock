from fastapi import APIRouter, Depends
from pydantic import BaseModel,EmailStr

auth_router = APIRouter()

# Dummy user data for now
fake_user_db = {
    "test@example.com": {
        "email": "test@example.com",
        "password": "$2b$12$3WXQ7Y902eFXohnZhbv7SujSXrq/lAG9c1JFMPUZGgDnQJgME8RJ."  # password: "password123" ""
    }
}

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str