from pydantic import BaseModel
from typing import List, Optional

class StudentCreate(BaseModel):
    phone: str
    branch: str
    year: int
    cgpa: float
    skills: List[str]
    bio: Optional[str] = None

class StudentUpdate(BaseModel):
    phone: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[int] = None
    cgpa: Optional[float] = None
    skills: Optional[List[str]] = None
    bio: Optional[str] = None