from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta

from database.connection import database
from schemas.user_schema import UserRegister, UserLogin
from auth.hashing import hash_password, verify_password
from auth.jwt_handler import create_access_token
from auth.dependencies import get_current_user
from database.connection import database, otp_collection
from utils.otp import generate_otp
from services.email_service import send_otp_email
from database.connection import otp_collection

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
        "role": "student",
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
@router.post("/forgot-password")
async def forgot_password(data: dict):
    email = data.get("email")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    db_user = await database["users"].find_one({"email": email})

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="No account found with this email"
        )

    otp = generate_otp()

    expires_at = datetime.utcnow() + timedelta(minutes=5)

    await otp_collection.delete_many({"email": email})

    await otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "expires_at": expires_at
    })

    await send_otp_email(email, otp)

    return {
        "success": True,
        "message": "OTP sent successfully"
    }
@router.post("/verify-otp")
async def verify_otp(data: dict):
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        raise HTTPException(
            status_code=400,
            detail="Email and OTP are required"
        )

    otp_data = await otp_collection.find_one({
        "email": email,
        "otp": otp
    })

    if not otp_data:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    if datetime.utcnow() > otp_data["expires_at"]:
        await otp_collection.delete_one({"_id": otp_data["_id"]})

        raise HTTPException(
            status_code=400,
            detail="OTP has expired"
        )

    return {
        "success": True,
        "message": "OTP verified successfully"
    }
@router.post("/reset-password")
async def reset_password(data: dict):
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")

    if not email or not otp or not new_password:
        raise HTTPException(
            status_code=400,
            detail="Email, OTP and new password are required"
        )

    # Check OTP
    otp_data = await otp_collection.find_one({
        "email": email,
        "otp": otp
    })

    if not otp_data:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # Check expiry
    if datetime.utcnow() > otp_data["expires_at"]:
        await otp_collection.delete_one({"_id": otp_data["_id"]})

        raise HTTPException(
            status_code=400,
            detail="OTP has expired"
        )

    # Hash the new password
    hashed_password = hash_password(new_password)

    # Update user password
    result = await database["users"].update_one(
        {"email": email},
        {
            "$set": {
                "password": hashed_password
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Delete OTP after successful reset
    await otp_collection.delete_one({
        "_id": otp_data["_id"]
    })

    return {
        "success": True,
        "message": "Password reset successfully"
    }