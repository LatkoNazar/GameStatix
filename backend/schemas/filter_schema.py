from pydantic import BaseModel
class FilterSchema(BaseModel):
    name: str
    value: str