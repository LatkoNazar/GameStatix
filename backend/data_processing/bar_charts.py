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

@router.post("/all-bar-data")
async def get_all_bar_data(filters: Optional[List[FilterSchema]] = None):
    new_data = data.copy()
    if filters:
        for filter in filters:
            new_data = new_data[new_data[filter.name] == filter.value]

    seasons = new_data["season"].unique().tolist()
    goals = new_data.groupby("season")["goals"].sum().astype(int).tolist()
    assists = new_data.groupby("season")["assists"].sum().astype(int).tolist()
    

    return JSONResponse(content={
            "goals_per_season" : {
                "season": seasons,
                "goals_per_season": goals
            },
            "assists_per_season": {
                "season": seasons,
                "assists_per_season": assists
            }
        })