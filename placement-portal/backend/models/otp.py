from pydantic import BaseModel
from datetime import datetime

class OTPModel(BaseModel):
    email: str
    otp: str
    expires_at: datetime