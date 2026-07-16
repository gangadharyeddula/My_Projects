from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
from database.connection import database
from bson import ObjectId
from datetime import datetime
from utils.email_service import send_email

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
async def admin_dashboard(current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    total_students = await database["students"].count_documents({})
    total_companies = await database["companies"].count_documents({})
    total_jobs = await database["jobs"].count_documents({})
    total_applications = await database["applications"].count_documents({})

    applied = await database["applications"].count_documents({
        "status": "Applied"
    })

    shortlisted = await database["applications"].count_documents({
        "status": "Shortlisted"
    })

    selected = await database["applications"].count_documents({
        "status": "Selected"
    })

    rejected = await database["applications"].count_documents({
        "status": "Rejected"
    })

    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_jobs": total_jobs,
        "total_applications": total_applications,

        "applied": applied,
        "shortlisted": shortlisted,
        "selected": selected,
        "rejected": rejected,
    }


@router.get("/students")
async def get_students(current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    students = []

    async for student in database["students"].find():
        student["_id"] = str(student["_id"])
        students.append(student)

    return {"students": students}


@router.get("/companies")
async def get_companies(current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    companies = []

    async for company in database["companies"].find():
        company["_id"] = str(company["_id"])
        companies.append(company)

    return {"companies": companies}


@router.get("/jobs")
async def get_jobs(current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    jobs = []

    async for job in database["jobs"].find():
        job["_id"] = str(job["_id"])
        jobs.append(job)

    return {"jobs": jobs}


@router.get("/applications")
async def get_applications(current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    applications = []

    async for app in database["applications"].find():
        app["_id"] = str(app["_id"])
        applications.append(app)

    return {"applications": applications}


@router.delete("/students/{student_id}")
async def delete_student(student_id: str, current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    student = await database["students"].find_one({"_id": ObjectId(student_id)})

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # delete student profile
    await database["students"].delete_one({"_id": ObjectId(student_id)})

    # delete applications
    await database["applications"].delete_many({
        "student_user_id": student["user_id"]
    })

    return {
        "message": "Student deleted successfully"
    }

@router.delete("/companies/{company_id}")
async def delete_company(company_id: str, current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    company = await database["companies"].find_one({"_id": ObjectId(company_id)})

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    await database["companies"].delete_one({"_id": ObjectId(company_id)})

    await database["jobs"].delete_many({
        "company_user_id": company["user_id"]
    })

    await database["applications"].delete_many({
        "company_name": company["company_name"]
    })

    return {
        "message": "Company deleted successfully"
    }
@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    job = await database["jobs"].find_one({"_id": ObjectId(job_id)})

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Delete all applications for this job
    await database["applications"].delete_many({
        "job_id": job_id
    })

    # Delete the job
    await database["jobs"].delete_one({
        "_id": ObjectId(job_id)
    })

    return {
        "message": "Job deleted successfully"
    }
@router.delete("/applications/{application_id}")
async def delete_application(
    application_id: str,
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    application = await database["applications"].find_one({
        "_id": ObjectId(application_id)
    })

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    await database["applications"].delete_one({
        "_id": ObjectId(application_id)
    })

    return {
        "message": "Application deleted successfully"
    }

@router.get("/recent-activities")
async def recent_activities(current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    activities = []

    # Latest Applications
    cursor = (
        database["applications"]
        .find()
        .sort("applied_at", -1)
        .limit(10)
    )

    async for app in cursor:

        activities.append({
            "type": "application",
            "message": f'{app["student_name"]} applied for {app["job_title"]}',
            "date": app["applied_at"]
        })

    return {
        "activities": activities
    }