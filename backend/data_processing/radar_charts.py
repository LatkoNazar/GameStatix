from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import JSONResponse
import httpx
from bs4 import BeautifulSoup
import pandas as pd
from data_load import data
from pydantic import BaseModel
from typing import List, Optional

from schemas.filter_schema import FilterSchema

router = APIRouter(prefix="/radar-charts")

@router.post("/all-radar-data")
async def get_radar_data(filters: Optional[List[FilterSchema]] = None):
    new_data = data.copy()
    if filters:
        for filter in filters:
            new_data = new_data[new_data[filter.name] == filter.value]

    new_data = new_data[
        (new_data["shots_on_target"].notna()) &
        (new_data["shots_on_target"].notna()) &
        (new_data["shots_total"] != 0)
    ]
    take_ons_data = new_data[
        (new_data["successful_take_ons"].notna()) &
        (new_data["take_ons_attempted"].notna()) &
        (new_data["take_ons_attempted"] != 0)
    ]
    carries_data = new_data[
        (new_data["progressive_carries"].notna()) &
        (new_data["carries"].notna()) &
        (new_data["carries"] != 0)
    ]
    defense_data_dribble = new_data[(new_data["dribles_tackled"].notna()) &
        (new_data["attempts"].notna()) &
        (new_data["attempts"] != 0)]
    defense_data_tackle = new_data[(new_data["num_players_tackled"].notna()) &
        (new_data["tackles_won"].notna()) &
        (new_data["num_players_tackled"] != 0)]
    mean_defense_data_dribble = round(float((defense_data_dribble["dribles_tackled"] / defense_data_dribble["attempts"]).mean()),4)
    mean_defense_data_tackle = round(float((defense_data_tackle["tackles_won"] / defense_data_tackle["num_players_tackled"]).mean()),4)

    labels = ["Shots", "Goal Contribution", "Passing", "Carries", "Take-Ons", "Defense"]
    values = [
        round(float((new_data["shots_on_target"] / new_data["shots_total"]).mean()), 4),
        float((new_data["goals"].sum() + new_data["assists"].sum()) / (new_data["minutes"].sum() / 90)),
        float((new_data["cmp%"] / 100).mean()),
        round(float((carries_data["progressive_carries"] / carries_data["carries"]).mean()), 4),
        round(float((take_ons_data["successful_take_ons"] / take_ons_data["take_ons_attempted"]).mean()), 4),
        (mean_defense_data_dribble + mean_defense_data_tackle) / 2
    ]

    return JSONResponse(content={
        "radar_stats": {
            "labels": labels,
            "values": values
        }
    })