from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd

from data_processing.pie_charts import router as pie_charts_router
from data_processing.player_info import router as player_info_router
from data_processing.bar_charts import router as bar_charts_router
def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(pie_charts_router)
    app.include_router(bar_charts_router)
    app.include_router(player_info_router)
    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=5000, reload=True)
