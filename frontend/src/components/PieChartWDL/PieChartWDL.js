import { useRef, useEffect, useState, useContext } from "react";
import { FiltersContext } from "../../pages/Dashboard/Dashboard";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, PieController);

export default function PieChartWDL() {
    const { filters, setFilters } = useContext(FiltersContext);
    const [data, setData] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        async function getWDL() {
            const response = await fetch(
                "http://localhost:5000/pie-charts/wdl",
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
        getWDL();
    }, [filters]);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: data.Result.map((item) => {
                    switch (item) {
                        case "W":
                            return "Win";
                        case "D":
                            return "Draw";
                        case "L":
                            return "Lose";
                        default:
                            break;
                    }
                }),
                datasets: [
                    {
                        label: "Wins / Draws / Loses",
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
                                item.name === "result" && item.value === label
                        );
                        if (!exists) {
                            setFilters((prev) => [
                                ...prev,
                                { name: "result", value: label },
                            ]);
                        } else {
                            setFilters((prev) =>
                                prev.filter(
                                    (item) =>
                                        !(
                                            item.name === "result" &&
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
    useEffect(() => {
        console.log("Filters updated:", filters);
    }, [filters]);
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
