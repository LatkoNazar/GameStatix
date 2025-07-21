import { useRef, useEffect, useState, useContext } from "react";
import { DataFiltersContext } from "../../pages/Dashboard/Dashboard";
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

export default function BarCharts(props) {
    const { data, setData, filters, setFilters } =
        useContext(DataFiltersContext);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    console.log("BAR PROPS:", props.data);
    useEffect(() => {
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: props.data.labels,
                datasets: [
                    {
                        label: props.label,
                        data: props.data.values,
                        backgroundColor: ["black"],
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
                        console.log({
                            name: props.colToFilterBy,
                            value: label,
                        });
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
