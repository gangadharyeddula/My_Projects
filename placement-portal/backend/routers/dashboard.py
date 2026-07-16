from fastapi import APIRouter, Depends, HTTPException
from database.connection import database
from auth.dependencies import get_current_user

router = APIRouter()

# -----------------------------
# STUDENT DASHBOARD STATS
# -----------------------------
@router.get("/student")
async def student_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can access student dashboard")

    student_profile = await database["students"].find_one({"user_id": current_user["_id"]})
    applications = await database["applications"].find({"student_user_id": current_user["_id"]}).to_list(length=None)
    jobs = await database["jobs"].count_documents({})

    shortlisted_count = sum(1 for app in applications if app.get("status") == "Shortlisted")
    selected_count = sum(1 for app in applications if app.get("status") == "Selected")

    return {
        "message": "Student dashboard stats fetched successfully",
        "stats": {
            "profile_completed": bool(student_profile),
            "jobs_available": jobs,
            "applications_count": len(applications),
            "shortlisted_count": shortlisted_count,
            "selected_count": selected_count,
        }
    }


# -----------------------------
# COMPANY DASHBOARD STATS
# -----------------------------
@router.get("/company")
async def company_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only companies can access company dashboard")

    company_profile = await database["companies"].find_one({"user_id": current_user["_id"]})
    jobs = await database["jobs"].find({"company_user_id": current_user["_id"]}).to_list(length=None)

    job_ids = [str(job["_id"]) for job in jobs]

    applications = []
    if job_ids:
        applications = await database["applications"].find({"job_id": {"$in": job_ids}}).to_list(length=None)

    shortlisted_count = sum(1 for app in applications if app.get("status") == "Shortlisted")
    selected_count = sum(1 for app in applications if app.get("status") == "Selected")

    return {
        "message": "Company dashboard stats fetched successfully",
        "stats": {
            "profile_completed": bool(company_profile),
            "jobs_posted": len(jobs),
            "total_applicants": len(applications),
            "shortlisted_count": shortlisted_count,
            "selected_count": selected_count,
        }
    }