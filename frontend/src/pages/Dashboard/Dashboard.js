import { useState, createContext } from "react";
import PieChartWDL from "../../components/PieChartWDL/PieChartWDL";
import PlayerInfo from "../../components/PlayerInfo/PlayerInfo";
import GoalsPerSeasonBarChart from "../../components/GoalsPerSeasonBarChart/GoalsPerSeasonBarChart";
import "./Dashboard.css";

export const FiltersContext = createContext(null);

export default function Dashboard() {
    const [filters, setFilters] = useState([]);

    return (
        <FiltersContext.Provider value={{ filters, setFilters }}>
            <div className="main-container">
                <div className="info">
                    <PlayerInfo />
                </div>
                <div className="charts">
                    <PieChartWDL />
                    <GoalsPerSeasonBarChart />
                </div>
            </div>
        </FiltersContext.Provider>
    );
}
