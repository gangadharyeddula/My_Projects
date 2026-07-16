from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime

from database.connection import database
from schemas.user_schema import UserRegister, UserLogin
from auth.hashing import hash_password, verify_password
from auth.jwt_handler import create_access_token
from auth.dependencies import get_current_user

router = APIRouter()

@router.post("/register")
async def register_user(user: UserRegister):
    existing_user = await database["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": user.role,
        "created_at": datetime.utcnow()
    }

    result = await database["users"].insert_one(user_data)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }

@router.post("/login")
async def login_user(user: UserLogin):
    db_user = await database["users"].find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        is_valid = verify_password(user.password, db_user["password"])
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Stored password format is invalid. Register this user again with a new email."
        )

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "email": db_user["email"],
        "role": db_user["role"]
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Current user fetched successfully",
        "user": {
            "id": current_user["_id"],
            "name": current_user["name"],
            "email": current_user["email"],
            "role": current_user["role"]
        }
    }