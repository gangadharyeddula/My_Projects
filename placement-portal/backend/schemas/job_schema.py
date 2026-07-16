from pydantic import BaseModel
from typing import List, Optional

class JobCreate(BaseModel):
    title: str
    description: str
    location: str
    salary: str
    skills_required: List[str]
    deadline: Optional[str] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    skills_required: Optional[List[str]] = None
    deadline: Optional[str] = None