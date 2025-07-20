import pandas as pd
import httpx
from bs4 import BeautifulSoup

def load_data():
    df = pd.read_csv("data/Lamine-Yamal.csv")
    df = df.rename(columns={
        "Comp": "competition",
        "Pos": "position",
        "Min": "minutes",
        "Gls": "goals",
        "Ast": "assists",
        "PK": "penalty_kicks_made",
        "PKatt": "penalty_kicks_attempted",
        "Sh": "shots_total",
        "Sot": "shots_on_target",
        "CrdY": "yellow_cards",
        "CrdR": "red_cards",
        "Tkl": "tackles",
        "Int": "interceptions",
        "SCA": "shot_creating_actions",
        "GCA": "goal_creating_actions",
        "Cmp": "passes_completed",
        "att": "passes_attempted",
        "PrgP": "progressive_passes",
        "PrgC": "progressive_carries",
        "Att.1": "take_ons_attempted",
        "Succ": "successful_take_ons"
    })
    df = df.drop(["Match Report"], axis=1)
    df = df[df["goals"] != "On matchday squad, but did not play"]
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.dropna(subset=["Date"])

    str_type_cols = ["Day", "competition", "Round","Venue","Result","Squad","Opponent","Start","position", "Season"]
    for col in str_type_cols:
        df[col] = df[col].astype("str")

    for col in df.columns:
        if col not in str_type_cols + ["Date"]:
            df[col] = df[col].astype("float64")

    df[["Result", "Score"]] = df["Result"].str.split(" ", n=1, expand=True)
    df.columns = [str(el).lower() for el in df.columns.to_list()]
    return df


def get_player_info_transfermarket(player_name: str):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    try:
        search_url = f"https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query={player_name}"
        response = httpx.get(search_url, headers=headers, timeout=10)
        if response.status_code != 200:
            raise ValueError("Error during player search")

        soup = BeautifulSoup(response.text, "html.parser")
        first_result = soup.find(class_="hauptlink")
        if not first_result:
            raise ValueError("No player found")
        player_url = "https://www.transfermarkt.com" + first_result.find("a")["href"]

        player_response = httpx.get(player_url, headers=headers, timeout=10)
        if player_response.status_code != 200:
            raise ValueError("Error during player page loading")

        player_soup = BeautifulSoup(player_response.text, "html.parser")
        info_result = []
        label_blocks = player_soup.select(".data-header__label")
        for label_block in label_blocks:
            text = label_block.get_text(strip=True)
            if text != "":
                text_list = text.split(":")
                label = text_list[0]
                content = text_list[1]
                info_result.append({"label": label, "content": content})
        image_link = player_soup.find(class_="data-header__profile-image")["src"]
        shirt_number = player_soup.find(class_="data-header__shirt-number").text.strip()
        name = player_soup.find(class_="data-header__headline-wrapper").find("strong").text
        info_result.append({"label": "image", "content" : image_link})
        info_result.append({"label": "Shirt number", "content" : shirt_number})
        info_result.append({"label": "Name", "content": name})

        print(info_result)
        return {"info": info_result}
    except Exception as e:
        raise ValueError("Error: {e}")

player_info = get_player_info_transfermarket("Lamine Yamal")
data = load_data()