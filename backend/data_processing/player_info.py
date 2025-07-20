from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from pydantic import BaseModel
from data_load import player_info

router = APIRouter(prefix="/player-info")

@router.get("/transfermarket-info")
async def get_player_info():
    return JSONResponse(content=player_info)
