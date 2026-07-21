from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
from database.connection import database
from bson import ObjectId
from datetime import datetime
from utils.email_service import send_email
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Admin"])

class RoleUpdate(BaseModel):
    role: str

@router.get("/dashboard")
async def admin_dashboard(current_user: dict = Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

       # Registered accounts based on access role
    total_student_accounts = await database["users"].count_documents({
        "role": "student"
    })
    
    total_company_accounts = await database["users"].count_documents({
        "role": "company"
    })
    
    # Completed profiles
    total_student_profiles = await database["students"].count_documents({})
    
    total_company_profiles = await database["companies"].count_documents({})
    
    # Jobs and applications
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
    interview = await database["applications"].count_documents({
    "status": "Interview"
    })
    
    placed = await database["applications"].count_documents({
        "status": "Placed"
    })


    return {
    "total_student_accounts": total_student_accounts,
    "total_company_accounts": total_company_accounts,

    "total_student_profiles": total_student_profiles,
    "total_company_profiles": total_company_profiles,

    "total_jobs": total_jobs,
    "total_applications": total_applications,

    "applied": applied,
    "shortlisted": shortlisted,
    "interview": interview,
    "selected": selected,
    "placed": placed,
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
@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    data: RoleUpdate,
    current_user: dict = Depends(get_current_user)
):
    # Only admins can change access
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access only"
        )

    allowed_roles = ["student", "company"]

    if data.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Allowed roles: student, company"
        )

    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    user = await database["users"].find_one({
        "_id": object_id
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Protect admin accounts
    if user.get("role") == "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin accounts cannot be modified"
        )

    old_role = user.get("role", "student")
    new_role = data.role

    if old_role == new_role:
        raise HTTPException(
            status_code=400,
            detail=f"User already has {new_role} access"
        )

    await database["users"].update_one(
        {"_id": object_id},
        {
            "$set": {
                "role": new_role,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "message": f"Access changed from {old_role} to {new_role} successfully",
        "user": {
            "id": user_id,
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "old_role": old_role,
            "new_role": new_role
        },
        "requires_relogin": True
    }
@router.get("/users")
async def get_all_users(
    current_user: dict = Depends(get_current_user)
):
    # Only admin can view registered users
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access only"
        )

    users = []

    cursor = database["users"].find(
        {},
        {
            "password": 0
        }
    ).sort("created_at", -1)

    async for user in cursor:
        users.append({
            "_id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "role": user.get("role", "student"),
            "created_at": user.get("created_at")
        })

    return {
        "message": "Users fetched successfully",
        "users": users
    }