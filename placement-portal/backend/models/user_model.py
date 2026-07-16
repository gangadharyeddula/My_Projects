from datetime import datetime

def user_helper(user: dict) -> dict:
    return {
        "name": user["name"],
        "email": user["email"],
        "password": user["password"],
        "role": user["role"],
        "created_at": datetime.utcnow()
    }