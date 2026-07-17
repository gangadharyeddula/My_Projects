from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "placement_portal")
SECRET_KEY = os.getenv("SECRET_KEY", "gangadhar_super_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
