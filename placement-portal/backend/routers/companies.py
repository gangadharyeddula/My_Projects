from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime

from database.connection import database
from auth.dependencies import get_current_user
from schemas.company_schema import CompanyCreate, CompanyUpdate

router = APIRouter()

@router.post("/profile")
async def create_company_profile(
    company: CompanyCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can create company profile")

    existing_profile = await database["companies"].find_one({"user_id": current_user["_id"]})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Company profile already exists")

    company_data = {
        "user_id": current_user["_id"],
        "email": current_user["email"],
        "company_name": company.company_name,
        "website": company.website,
        "location": company.location,
        "description": company.description,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await database["companies"].insert_one(company_data)

    return {
        "message": "Company profile created successfully",
        "company_profile_id": str(result.inserted_id)
    }


@router.get("/profile")
async def get_my_company_profile(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can access company profile")

    company = await database["companies"].find_one({"user_id": current_user["_id"]})
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    company["_id"] = str(company["_id"])
    return {
        "message": "Company profile fetched successfully",
        "profile": company
    }


@router.put("/profile")
async def update_company_profile(
    company: CompanyUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only company users can update company profile")

    existing_profile = await database["companies"].find_one({"user_id": current_user["_id"]})
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    update_data = {k: v for k, v in company.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await database["companies"].update_one(
        {"user_id": current_user["_id"]},
        {"$set": update_data}
    )

    return {
        "message": "Company profile updated successfully"
    }
@router.get("/dashboard")
async def company_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Access denied")

    jobs_count = await database["jobs"].count_documents({
        "company_user_id": current_user["_id"]
    })

    applications = database["applications"].find({
        "company_user_id": current_user["_id"]
    })

    total_applications = 0
    pending = 0
    shortlisted = 0
    interview = 0
    selected = 0
    placed = 0
    rejected = 0

    async for app in applications:
        total_applications += 1

        status = app.get("status", "Applied")

        if status == "Applied":
            pending += 1
        elif status == "Shortlisted":
            shortlisted += 1
        elif status == "Interview":
            interview += 1
        elif status == "Selected":
            selected += 1
        elif status == "Placed":
            placed += 1
        elif status == "Rejected":
            rejected += 1

    return {
        "total_jobs": jobs_count,
        "total_applications": total_applications,
        "pending": pending,
        "shortlisted": shortlisted,
        "interview": interview,
        "selected": selected,
        "placed": placed,
        "rejected": rejected,
    }