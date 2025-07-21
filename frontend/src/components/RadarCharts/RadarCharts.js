import { useRef, useEffect, useState, useContext } from "react";
import { DataFiltersContext } from "../../pages/Dashboard/Dashboard";
import {
    Chart,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    RadarController,
} from "chart.js";

Chart.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    RadarController
);

export default function RadarCharts(props) {
    const { data, setData, filters, setFilters } =
        useContext(DataFiltersContext);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    console.log("Radar props", props.data);
    useEffect(() => {
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
            type: "radar",
            data: {
                labels: props.data.labels,
                datasets: [
                    {
                        label: props.data.labels,
                        data: props.data.values,
                        backgroundColor: "rgba(0, 128, 255, 0.2)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        });
    }, [data]);

    return (
        <div style={{ width: "500px", height: "500px" }}>
            <canvas ref={chartRef} />
        </div>
    );
}
