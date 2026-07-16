from pydantic import BaseModel
from typing import Optional

class CompanyCreate(BaseModel):
    company_name: str
    website: Optional[str] = None
    location: str
    description: Optional[str] = None

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None