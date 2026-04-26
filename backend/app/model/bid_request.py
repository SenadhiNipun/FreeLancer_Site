from pydantic import BaseModel, Field
from typing import Optional


class BidRequest(BaseModel):
    bid_amount: float = Field(..., gt=0, description="Writer's proposed price (must be > 0)")
    message: Optional[str] = Field(None, max_length=1000, description="Writer's pitch / cover message")
