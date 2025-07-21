import { useEffect, useState } from "react";
import "./PlayerInfo.css";

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
            <div class="playerIMG">
                <h1 style={{ marginTop: 0 }}>
                    {playerInfo.find((item) => item.label === "Name")
                        ?.content || "N/A"}
                </h1>
                <img
                    src={
                        playerInfo.find((item) => item.label === "player_image")
                            ?.content
                    }
                    alt={
                        playerInfo.find((item) => item.label === "Name")
                            ?.content || "Player"
                    }
                    style={{
                        maxWidth: "200px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <strong style={{ marginRight: 5 }}>Club:</strong>{" "}
                <img
                    src={
                        playerInfo.find((item) => item.label === "club_image")
                            ?.content
                    }
                    alt={
                        playerInfo.find((item) => item.label === "club_image")
                            ?.alt
                    }
                    width="50"
                    height="50"
                />
                <strong style={{ marginRight: 5 }}>League:</strong>{" "}
                <img
                    src={
                        playerInfo.find((item) => item.label === "league_image")
                            ?.content
                    }
                    alt={
                        playerInfo.find((item) => item.label === "league_image")
                            ?.alt
                    }
                    width="50"
                    height="50"
                />
            </div>

            <p>
                <strong>Shirt number:</strong>{" "}
                {playerInfo.find((item) => item.label === "Shirt number")
                    ?.content || "N/A"}
            </p>

            {playerInfo
                .filter(
                    (item) =>
                        item.label !== "player_image" &&
                        item.label !== "club_image" &&
                        item.label !== "league_image" &&
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
