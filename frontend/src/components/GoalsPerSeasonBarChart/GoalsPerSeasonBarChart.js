import { useRef, useEffect, useState, useContext } from "react";
import { FiltersContext } from "../../pages/Dashboard/Dashboard";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController,
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController
);

export default function GoalsPerSeasonBarChart() {
    const { filters, setFilters } = useContext(FiltersContext);
    const [data, setData] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        async function getGoalsPerSeason() {
            const response = await fetch(
                "http://localhost:5000/bar-charts/goals-per-season",
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

            const json = await response.json();
            setData(json);
        }
        getGoalsPerSeason();
    }, [filters]);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.Result,
                datasets: [
                    {
                        label: "Goals per season",
                        data: data.Count,
                        backgroundColor: ["blue", "green", "red"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                onClick: (event, elements, chart) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const label = data.Result[index];
                        const exists = filters.some(
                            (item) =>
                                item.name === "season" && item.value === label
                        );

                        if (!exists) {
                            setFilters((prev) => [
                                ...prev,
                                { name: "season", value: label },
                            ]);
                        } else {
                            setFilters((prev) =>
                                prev.filter(
                                    (item) =>
                                        !(
                                            item.name === "season" &&
                                            item.value === label
                                        )
                                )
                            );
                        }
                    }
                },
            },
        });
    }, [data]);

    return (
        <div
        // style={{
        //     flexGrow: 1,
        //     maxHeight: "300px",
        //     display: "flex",
        //     justifyContent: "center",
        // }}
        >
            <canvas ref={chartRef} height={300} />
        </div>
    );
}
