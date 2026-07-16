from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from database.connection import database
from auth.dependencies import get_current_user
from schemas.job_schema import JobCreate, JobUpdate

from database.connection import database
from auth.dependencies import get_current_user
from schemas.job_schema import JobCreate, JobUpdate

router = APIRouter()

@router.post("/")
async def create_job(
    job: JobCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can post jobs")

    company = await database["companies"].find_one({"user_id": current_user["_id"]})
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found. Create company profile first.")

    job_data = {
        "company_user_id": current_user["_id"],
        "company_profile_id": str(company["_id"]),
        "company_name": company["company_name"],
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "salary": job.salary,
        "skills_required": job.skills_required,
        "deadline": job.deadline,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await database["jobs"].insert_one(job_data)

    return {
        "message": "Job posted successfully",
        "job_id": str(result.inserted_id)
    }


@router.get("/my-jobs")
async def get_my_jobs(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can access their jobs")

    jobs_cursor = database["jobs"].find({"company_user_id": current_user["_id"]})
    jobs = []

    async for job in jobs_cursor:
        job["_id"] = str(job["_id"])
        jobs.append(job)

    return {
        "message": "Jobs fetched successfully",
        "jobs": jobs
    }


@router.put("/{job_id}")
async def update_job(
    job_id: str,
    job: JobUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can update jobs")

    existing_job = await database["jobs"].find_one({
        "_id": ObjectId(job_id),
        "company_user_id": current_user["_id"]
    })

    if not existing_job:
        raise HTTPException(status_code=404, detail="Job not found or not authorized")

    update_data = {k: v for k, v in job.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await database["jobs"].update_one(
        {"_id": ObjectId(job_id)},
        {"$set": update_data}
    )

    return {"message": "Job updated successfully"}


@router.delete("/{job_id}")
async def delete_job(job_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can delete jobs")

    existing_job = await database["jobs"].find_one({
        "_id": ObjectId(job_id),
        "company_user_id": current_user["_id"]
    })

    if not existing_job:
        raise HTTPException(status_code=404, detail="Job not found or not authorized")

    await database["jobs"].delete_one({"_id": ObjectId(job_id)})

    return {"message": "Job deleted successfully"}