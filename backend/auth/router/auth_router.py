from fastapi import APIRouter,status,HTTPException,Depends
from auth.schema import TokenResponse,LoginRequest,UserCreate
from auth.service import verify_password,create_access_token,get_password_hash
from dependencies import get_db
from sqlalchemy.orm import Session
from ..models import User

auth_router = APIRouter()

@auth_router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest,db: Session = Depends(get_db)):
    # user = fake_user_db.get(request.email)
    user = db.query(User).filter(User.email==request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    print(user.hashed_password)
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": request.email})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/users/")
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@auth_router.post("/register")
def register_user(request: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = get_password_hash(request.password)

    # Create user object
    new_user = User(
        email=request.email,
        hashed_password=hashed_password,
        first_name=request.first_name,
        last_name=request.last_name
    )

    # Save to DB
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}