import { useRef, useEffect, useState, useContext } from "react";
import { DataFiltersContext } from "../../pages/Dashboard/Dashboard";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, PieController);

export default function PieChartWDL(props) {
    const { filters, setFilters, data, setData } =
        useContext(DataFiltersContext);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: props.data.labels.map((item) => {
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
                        label: props.label,
                        data: props.data.values,
                        backgroundColor: ["blue", "green", "red"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                onClick: (event, elements, chart) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const label = props.data.labels[index];
                        const exists = filters.some(
                            (item) =>
                                item.name === props.colToFilterBy &&
                                item.value === label
                        );
                        if (!exists) {
                            setFilters((prev) => [
                                ...prev,
                                { name: props.colToFilterBy, value: label },
                            ]);
                        } else {
                            setFilters((prev) =>
                                prev.filter(
                                    (item) =>
                                        !(
                                            item.name === props.colToFilterBy &&
                                            item.value === label
                                        )
                                )
                            );
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
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
            <p>{props.label}</p>
            <canvas ref={chartRef} height={300} />
        </div>
    );
}
