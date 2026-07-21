from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers.admin import router as admin_router
from routers.auth import router as auth_router
from routers.students import router as student_router
from routers.companies import router as company_router
from routers.jobs import router as job_router
from routers.applications import router as application_router
from database.connection import database
from routers.dashboard import router as dashboard_router
from routers.admin import router as admin_router

app = FastAPI(title="Placement Portal API")

os.makedirs("uploads/resumes", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(student_router, prefix="/students", tags=["Students"])
app.include_router(company_router, prefix="/companies", tags=["Companies"])
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(application_router, prefix="/applications", tags=["Applications"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(admin_router)
@app.get("/")
def home():
    return {"message": "Placement Portal Backend is Running Successfully"}
print("Gangadhar is a good boy")
@app.get("/test-db")
async def test_db():
    collections = await database.list_collection_names()
    return {
        "message": "MongoDB connected successfully",
        "collections": collections
    }