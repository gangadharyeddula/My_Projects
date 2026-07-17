import asyncio
from email_service import send_otp_email

asyncio.run(
    send_otp_email(
        "gangadharyeddula143@gmail.com",
        "123456"
    )
)