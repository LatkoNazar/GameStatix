from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import JSONResponse
import httpx
from bs4 import BeautifulSoup
import pandas as pd
from data_load import data
from pydantic import BaseModel
from typing import List, Optional

from schemas.filter_schema import FilterSchema

router = APIRouter(prefix="/bar-charts")

@router.post("/goals-per-season")
async def get_player_info(filters: Optional[List[FilterSchema]] = None):
    new_data = data.copy()
    if filters:
        for filter in filters:
            new_data = new_data[new_data[filter.name] == filter.value]
    labels = new_data["season"].unique().tolist()
    values = new_data.groupby(by="season")["goals"].sum()
    df_chart_json = {
        "Result": labels,
        "Count": values.astype(int).tolist()
    }
    return JSONResponse(content=df_chart_json)