import { useEffect, useState } from "react";

export default function PlayerInfo() {
    const [playerInfo, setPlayerInfo] = useState(null);
    useEffect(() => {
        const getUserInfo = async () => {
            const response = await fetch(
                "http://localhost:5000/player-info/transfermarket-info"
            );
            if (!response.ok) {
                console.error("Error response!", response.status);
                return;
            }
            const json = await response.json();
            setPlayerInfo(json.info);
        };
        getUserInfo();
    }, []);

    if (!playerInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="info-container">
            <h1>Player Info</h1>

            <img
                src={playerInfo.find((item) => item.label === "image")?.content}
                alt={
                    playerInfo.find((item) => item.label === "Name")?.content ||
                    "Player"
                }
                style={{
                    maxWidth: "200px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            />

            <p>
                <strong>Name:</strong>{" "}
                {playerInfo.find((item) => item.label === "Name")?.content ||
                    "N/A"}
            </p>

            <p>
                <strong>Shirt number:</strong>{" "}
                {playerInfo.find((item) => item.label === "Shirt number")
                    ?.content || "N/A"}
            </p>

            {playerInfo
                .filter(
                    (item) =>
                        item.label !== "image" &&
                        item.label !== "Name" &&
                        item.label !== "Shirt number"
                )
                .map((item, idx) => (
                    <p key={idx}>
                        <strong>{item.label}:</strong> {item.content}
                    </p>
                ))}
        </div>
    );
}
