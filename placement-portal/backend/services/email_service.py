from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS") == "True",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

async def send_otp_email(email: str, otp: str):
    html = f"""
    <html>
    <body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px;">
            <h2 style="color:#2563eb;">Newton's Institute of Engineering</h2>

            <h3>Placement Portal</h3>

            <p>Your One Time Password (OTP) is</p>

            <h1 style="text-align:center;color:#2563eb;letter-spacing:6px;">
                {otp}
            </h1>

            <p>This OTP is valid for <b>5 minutes</b>.</p>

            <hr>

            <small>
                If you didn't request this password reset, please ignore this email.
            </small>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Password Reset OTP",
        recipients=[email],
        body=html,
        subtype="html",
    )

    fm = FastMail(conf)
    await fm.send_message(message)