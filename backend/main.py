from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from auth.router.auth_router import auth_router
from question.router import question_router
from db import Base, engine

Base.metadata.create_all(bind=engine)

load_dotenv()

app = FastAPI()


origins = [
    "http://localhost:5173",  # React dev server
    # You can add more URLs here (production frontend URLs)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # allowed frontend origins
    allow_credentials=True,
    allow_methods=["*"],              # allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],              # allow all headers (Authorization, Content-Type, etc.)
)


# Initialize FastAPI Router
app.include_router(auth_router,prefix="/auth")
app.include_router(question_router, prefix="/question")