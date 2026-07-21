from pydantic import BaseModel
from typing import Literal

class ApplicationStatusUpdate(BaseModel):
    status: Literal[
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Placed",
        "Rejected"
    ]