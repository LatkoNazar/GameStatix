from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import JSONResponse
import httpx
from bs4 import BeautifulSoup
import pandas as pd
from data_load import data
from pydantic import BaseModel
from typing import List, Optional

from schemas.filter_schema import FilterSchema

router = APIRouter(prefix="/pie-charts")

@router.post("/all-pie-data")
async def get_wdl_data(filters: Optional[List[FilterSchema]] = None):
    new_data = data.copy()
    if filters:
        for filter in filters:
            new_data = new_data[new_data[filter.name] == filter.value]
    wdl_labels = ["W", "D", "L"]
    wdl_values = [
        int(new_data[new_data["result"] == "W"]["result"].count()),
        int(new_data[new_data["result"] == "D"]["result"].count()),
        int(new_data[new_data["result"] == "L"]["result"].count())
    ]

    return JSONResponse(content={
        "wdl_data": {
            "result": wdl_labels,
            "counts": wdl_values
        }
    })