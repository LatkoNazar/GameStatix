import httpx
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
import pandas as pd
import csv

def get_seasons(html):
    soup = BeautifulSoup(html, "html.parser")
    p_tag = soup.find("p", string="Match Logs (Summary)")
    ul_tag = p_tag.find_next_sibling("ul")
    years = []
    for li in ul_tag.find_all("li"):
        a = li.find("a")
        if a.text != "National Team":
            years.append(a.text)
    return years


def get_table(html):
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", id="matchlogs_all")
    html_table = str(table)
    table_df = pd.read_html(html_table, header=[1])
    return table_df


def get_fbref_page(page_name):
    print("START")
    options = Options()
    options.add_argument("--headless")
    options.add_argument('--headless=new')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--ignore-ssl-errors')
    try:
        driver = webdriver.Chrome(options=options)
        driver.get("https://fbref.com/en/players/82ec26c1/Lamine-Yamal")
        html = driver.page_source
        driver.quit()

        seasons = get_seasons(html)

        all_matches = pd.DataFrame()

        for season in seasons:
            driver = webdriver.Chrome(options=options)
            print(season)
            url = f"https://fbref.com/en/players/82ec26c1/matchlogs/{season}/{page_name}/Lamine-Yamal-Match-Logs"
            driver.get(url)
            html = driver.page_source
            table_list = get_table(html)

            if table_list and not table_list[0].empty:
                df = table_list[0]
                df["Season"] = season
                all_matches = pd.concat([all_matches, df], ignore_index=True)
            driver.quit()
        all_matches.to_csv(
            f"data/Lamine-Yamal_{page_name}.csv",
            index=False,
            encoding="utf-8-sig",
            quoting=csv.QUOTE_ALL,
            quotechar='"'
        )
    except Exception as e:
        print(e)
        driver.quit()

get_fbref_page("summary")
get_fbref_page("gca")
get_fbref_page("defense")

