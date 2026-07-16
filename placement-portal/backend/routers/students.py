from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from fastapi import UploadFile, File
import shutil
import os

from database.connection import database
from auth.dependencies import get_current_user
from schemas.student_schema import StudentCreate, StudentUpdate

router = APIRouter()

@router.post("/profile")
async def create_student_profile(
    student: StudentCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can create student profile")

    existing_profile = await database["students"].find_one({"user_id": current_user["_id"]})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Student profile already exists")

    student_data = {
        "user_id": current_user["_id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "phone": student.phone,
        "branch": student.branch,
        "year": student.year,
        "cgpa": student.cgpa,
        "skills": student.skills,
        "bio": student.bio,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await database["students"].insert_one(student_data)

    return {
        "message": "Student profile created successfully",
        "student_profile_id": str(result.inserted_id)
    }


@router.get("/profile")
async def get_my_student_profile(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can access student profile")

    student = await database["students"].find_one({"user_id": current_user["_id"]})
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    student["_id"] = str(student["_id"])
    return {
        "message": "Student profile fetched successfully",
        "profile": student
    }


@router.put("/profile")
async def update_student_profile(
    student: StudentUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can update student profile")

    existing_profile = await database["students"].find_one({"user_id": current_user["_id"]})
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    update_data = {k: v for k, v in student.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await database["students"].update_one(
        {"user_id": current_user["_id"]},
        {"$set": update_data}
    )

    return {
        "message": "Student profile updated successfully"
    }
@router.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can upload resume")

    if not resume.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    upload_dir = "uploads/resumes"

    os.makedirs(upload_dir, exist_ok=True)

    filename = f'{current_user["_id"]}.pdf'

    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    resume_url = f"/uploads/resumes/{filename}"

    await database["students"].update_one(
        {"user_id": current_user["_id"]},
        {
            "$set": {
                "resume_url": resume_url
            }
        }
    )

    return {
        "message": "Resume uploaded successfully",
        "resume_url": resume_url
    }