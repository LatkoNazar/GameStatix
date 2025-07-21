import { useState, createContext, useEffect } from "react";
import PieCharts from "../../components/PieCharts/PieChars";
import PlayerInfo from "../../components/PlayerInfo/PlayerInfo";
import BarCharts from "../../components/BarCharts/BarCharts";
import "./Dashboard.css";
import RadarCharts from "../../components/RadarCharts/RadarCharts";

export const DataFiltersContext = createContext(null);

export default function Dashboard() {
    const [filters, setFilters] = useState([]);
    const [data, setData] = useState({});

    useEffect(() => {
        async function getAllBarData() {
            const response = await fetch(
                "http://localhost:5000/bar-charts/all-bar-data",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(filters || []),
                }
            );

            if (!response.ok) {
                console.error("Error response", response.status);
                return;
            }

            const bar_json = await response.json();
            setData((prev) => ({ ...prev, ...bar_json }));
        }
        getAllBarData();

        async function getPieChartsData() {
            const response = await fetch(
                "http://localhost:5000/pie-charts/all-pie-data",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(filters || []),
                }
            );
            if (!response.ok) {
                console.error("Error response", response.status);
                return;
            }

            const pie_json = await response.json();
            setData((prev) => ({ ...prev, ...pie_json }));
        }
        getPieChartsData();

        async function getRadarChartsData() {
            const response = await fetch(
                "http://localhost:5000/radar-charts/all-radar-data",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(filters || []),
                }
            );
            if (!response.ok) {
                console.error("Error response", response.status);
                return;
            }

            const radar_json = await response.json();
            setData((prev) => ({ ...prev, ...radar_json }));
        }
        getRadarChartsData();
    }, [filters]);

    useEffect(() => {
        if (data) {
            console.log("Оновлені дані:", data);
        }
    }, [data]);
    return (
        <DataFiltersContext.Provider
            value={{ data, setData, filters, setFilters }}
        >
            <div className="main-container">
                <div className="info">
                    <PlayerInfo />
                </div>
                <div className="charts">
                    {/*RADAR CHART*/}
                    <div className="radar-chart-container">
                        <RadarCharts
                            label="Player's radar"
                            data={
                                data.radar_stats
                                    ? {
                                          labels: data.radar_stats.labels,
                                          values: data.radar_stats.values,
                                      }
                                    : { labels: [], values: [] }
                            }
                        />
                    </div>
                    <div className="other-charts-container">
                        {/*WDL PIE CHART*/}
                        <PieCharts
                            colToFilterBy="result"
                            label="WINS / DRAWS / LOSES"
                            data={
                                data.wdl_data
                                    ? {
                                          labels: data.wdl_data.result,
                                          values: data.wdl_data.counts,
                                      }
                                    : { labels: [], values: [] }
                            }
                        />
                        {/*GOALS PER SEASON BAR CHART*/}
                        <BarCharts
                            colToFilterBy="season"
                            label="GOALS PER SEASON"
                            data={
                                data.goals_per_season
                                    ? {
                                          labels: data.goals_per_season.season,
                                          values: data.goals_per_season
                                              .goals_per_season,
                                      }
                                    : { labels: [], values: [] }
                            }
                        />
                        {/*ASSISTS PER SEASON BAR CHART*/}
                        <BarCharts
                            colToFilterBy="season"
                            label="ASSISTS PER SEASON"
                            data={
                                data.assists_per_season
                                    ? {
                                          labels: data.assists_per_season
                                              .season,
                                          values: data.assists_per_season
                                              .assists_per_season,
                                      }
                                    : { labels: [], values: [] }
                            }
                        />
                    </div>
                </div>
            </div>
        </DataFiltersContext.Provider>
    );
}
