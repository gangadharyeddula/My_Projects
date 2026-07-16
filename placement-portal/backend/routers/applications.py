from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from utils.email_service import send_email

from database.connection import database
from auth.dependencies import get_current_user
from schemas.application_schema import ApplicationStatusUpdate

router = APIRouter()

# -------------------------------
# STUDENT: View all jobs
# -------------------------------
@router.get("/jobs")
async def get_all_jobs(current_user: dict = Depends(get_current_user)):
    jobs_cursor = database["jobs"].find()
    jobs = []

    async for job in jobs_cursor:
        job["_id"] = str(job["_id"])
        jobs.append(job)

    return {
        "message": "All jobs fetched successfully",
        "jobs": jobs
    }


# -------------------------------
# STUDENT: View single job
# -------------------------------
@router.get("/jobs/{job_id}")
async def get_single_job(job_id: str, current_user: dict = Depends(get_current_user)):
    job = await database["jobs"].find_one({"_id": ObjectId(job_id)})

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job["_id"] = str(job["_id"])
    return {
        "message": "Job fetched successfully",
        "job": job
    }


# -------------------------------
# STUDENT: Apply for a job
# -------------------------------
@router.post("/apply/{job_id}")
async def apply_for_job(job_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can apply for jobs")

    # get student profile
    student_profile = await database["students"].find_one({"user_id": current_user["_id"]})
    if not student_profile:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found. Create student profile first."
        )

    # get job
    job = await database["jobs"].find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # check already applied
    existing_application = await database["applications"].find_one({
        "job_id": job_id,
        "student_user_id": current_user["_id"]
    })

    if existing_application:
        raise HTTPException(status_code=400, detail="You already applied for this job")

    # store full student snapshot in application
    application_data = {
        "job_id": job_id,
        "job_title": job.get("title", ""),
        "company_name": job.get("company_name", ""),
        "company_user_id": job.get("company_user_id", ""),

        "student_user_id": current_user["_id"],
        "student_profile_id": str(student_profile["_id"]),

        "student_name": student_profile.get("full_name", current_user.get("name", "Student")),
        "student_email": current_user.get("email", ""),
        "phone": student_profile.get("phone", ""),
        "branch": student_profile.get("branch", ""),
        "cgpa": student_profile.get("cgpa", ""),
        "skills": student_profile.get("skills", []),
        "resume_link": student_profile.get("resume_link", ""),

        "status": "Applied",
        "applied_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await database["applications"].insert_one(application_data)

    return {
        "message": "Applied successfully",
        "application_id": str(result.inserted_id)
    }


# -------------------------------
# STUDENT: View my applications
# -------------------------------
@router.get("/my-applications")
async def get_my_applications(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can view their applications")

    applications_cursor = database["applications"].find({
        "student_user_id": current_user["_id"]
    })

    applications = []
    async for application in applications_cursor:
        application["_id"] = str(application["_id"])
        applications.append(application)

    return {
        "message": "Applications fetched successfully",
        "applications": applications
    }


# -------------------------------
# COMPANY: View applicants for one job
# -------------------------------
@router.get("/job-applicants/{job_id}")
async def get_job_applicants(job_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can view applicants")

    job = await database["jobs"].find_one({
        "_id": ObjectId(job_id),
        "company_user_id": current_user["_id"]
    })

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    cursor = database["applications"].find({"job_id": job_id})

    applicants = []

    async for application in cursor:

        student = await database["students"].find_one({
            "user_id": application["student_user_id"]
        })

        applicants.append({
            "_id": str(application["_id"]),
            "student_name": application.get("student_name"),
            "student_email": application.get("student_email"),

            "phone": student.get("phone") if student else "",
            "branch": student.get("branch") if student else "",
            "cgpa": student.get("cgpa") if student else "",
            "skills": student.get("skills") if student else [],
            "resume_url": student.get("resume_url") if student else "",

            "status": application["status"],
            "applied_at": application["applied_at"]
        })

    return {
        "message": "Applicants fetched successfully",
        "applicants": applicants
    }

# -------------------------------
# COMPANY: Update application status
# -------------------------------
@router.put("/update-status/{application_id}")
async def update_application_status(
    application_id: str,
    status_data: ApplicationStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can update application status")

    application = await database["applications"].find_one({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    job = await database["jobs"].find_one({
        "_id": ObjectId(application["job_id"]),
        "company_user_id": current_user["_id"]
    })

    if not job:
        raise HTTPException(status_code=403, detail="Not authorized to update this application")

    await database["applications"].update_one(
        {"_id": ObjectId(application_id)},
        {
            "$set": {
                "status": status_data.status,
                "updated_at": datetime.utcnow()
            }
        }
    )
    application = await database["applications"].find_one(
        {"_id": ObjectId(application_id)}
    )
    
    subject = "Placement Portal - Application Status Updated"
    
    body = f"""
    Hello {application['student_name']},
    
    Your application status has been updated.
    
    Company : {application['company_name']}
    
    Job : {application['job_title']}
    
    New Status : {status_data.status}
    
    Best Wishes,
    
    Placement Cell
    Newton's Institute of Engineering
    """
    
    send_email(
        to_email=application["student_email"],
        subject=subject,
        body=body
    )

    return {
        "message": f"Application status updated to {status_data.status}"
    }