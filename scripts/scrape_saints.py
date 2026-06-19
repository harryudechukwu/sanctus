"""
Scrape saint data from catholic.org/saints/saint.php?saint_id=N

Usage:
    python scripts/scrape_saints.py [end_id]

Resumes from last saved ID. Defaults to 7000.
"""

import json
import logging
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.catholic.org/saints/saint.php?saint_id={}"
OUTPUT = Path(__file__).resolve().parent.parent / "saints_scraped.json"
STATE = Path(__file__).resolve().parent.parent / ".scrape_state.json"
WORKERS = 15

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(message)s",
    datefmt="%H:%M:%S",
)

session = requests.Session()


def slugify(name):
    slug = re.sub(r"[^\w\s-]", "", name.lower().strip())
    slug = re.sub(r"[\s_]+", "-", slug)
    return re.sub(r"-+", "-", slug).strip("-")


def clean(text):
    return re.sub(r"\s+", " ", text).strip() if text else ""


def parse_feast_day(soup):
    panel = soup.find("div", class_="panel-body")
    if not panel:
        return None
    for a in panel.find_all("a"):
        if "Feastday" in a.get_text(strip=True):
            raw = a.next_sibling
            if raw and isinstance(raw, str):
                return clean(raw)
            m = re.search(r"Feastday:\s*(.*?)(?:Patron:|Birth:|Death:|$)", panel.get_text())
            if m:
                return clean(m.group(1))
    return None


def parse_patronage(soup):
    panel = soup.find("div", class_="panel-body")
    if not panel:
        return []
    for a in panel.find_all("a"):
        if "Patron" in a.get_text(strip=True):
            raw = a.next_sibling
            if raw and isinstance(raw, str):
                return [clean(raw)]
            m = re.search(r"Patron:\s*(.*?)(?:Birth:|Death:|$)", panel.get_text())
            if m:
                parts = [p.strip() for p in m.group(1).split(",") if p.strip()]
                return parts if parts else [clean(m.group(1))]
    col = soup.find("div", class_="col-body")
    if col:
        m = re.search(r"Patron:\s*(.*?)(?:Birth:|Death:|$)", col.get_text())
        if m:
            parts = [p.strip() for p in m.group(1).split(",") if p.strip()]
            return parts if parts else [clean(m.group(1))]
    return []


def parse_death_year(soup):
    for src in [soup.find("div", class_="panel-body"), soup.find("div", class_="col-body")]:
        if src:
            m = re.search(r"Death:\s*(\d{3,4})", src.get_text())
            if m:
                return int(m.group(1))
    return None


def parse_origin_country(soup):
    content = soup.find("div", id="saintContent")
    if content:
        m = re.search(r"born\s+(?:in|at|near)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)", content.get_text(), re.IGNORECASE)
        if m:
            return clean(m.group(1))
    return None


def parse_biography(soup):
    content = soup.find("div", id="saintContent")
    if not content:
        return ""
    paras = [clean(p.get_text()) for p in content.find_all("p") if clean(p.get_text())]
    return "\n\n".join(paras)


def parse_image(soup):
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        url = og["content"]
        return "https:" + url if url.startswith("//") else url
    content = soup.find("div", id="saintContent")
    if content:
        img = content.find("img")
        if img:
            src = img.get("src") or img.get("data-src") or ""
            if src and not src.startswith("data:"):
                return "https:" + src if src.startswith("//") else src
    return None


def parse_type(name):
    lower = name.lower()
    if any(w in lower for w in ["archangel", "angel michael", "angel gabriel", "angel raphael"]):
        return "angel"
    return "saint"


def parse_name(soup):
    title = soup.title.string if soup.title else ""
    m = re.match(r"(.+?)\s*-\s*Saints", title)
    return clean(m.group(1)) if m else clean(title)


def scrape_saint(saint_id):
    try:
        resp = session.get(BASE_URL.format(saint_id), timeout=15)
        resp.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    name = parse_name(soup)
    if not name:
        return None

    bio = parse_biography(soup)
    paras = bio.split("\n\n")

    return {
        "id": slugify(name),
        "name": name,
        "type": parse_type(name),
        "feast_day": parse_feast_day(soup),
        "patronage": parse_patronage(soup),
        "short_bio": clean(paras[0]) if paras else "",
        "full_bio": bio,
        "symbols": [],
        "image_url": parse_image(soup),
        "death_year": parse_death_year(soup),
        "origin_country": parse_origin_country(soup),
    }


def load_json(path):
    if path.exists():
        with open(path, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    return None


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=True)


def main():
    end = int(sys.argv[1]) if len(sys.argv) > 1 else 7000

    saints = load_json(OUTPUT) or []
    state = load_json(STATE) or {"last_id": 0}
    start = state["last_id"] + 1
    scraped_ids = {s.get("id") for s in saints}
    logging.info("Loaded %d saints — resuming from ID %d", len(saints), start)

    ids_to_check = list(range(start, end + 1))
    new_saints = 0
    checked = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        fut_map = {executor.submit(scrape_saint, sid): sid for sid in ids_to_check}
        for future in as_completed(fut_map):
            sid = fut_map[future]
            result = future.result()
            checked += 1

            if result and result["id"] not in scraped_ids:
                saints.append(result)
                scraped_ids.add(result["id"])
                new_saints += 1
                if new_saints % 10 == 0:
                    write_json(OUTPUT, saints)
                    write_json(STATE, {"last_id": sid})

            if checked % 200 == 0:
                logging.info("Progress: %d/%d checked, %d new", checked, len(ids_to_check), new_saints)
                write_json(OUTPUT, saints)
                write_json(STATE, {"last_id": sid})

    write_json(OUTPUT, saints)
    write_json(STATE, {"last_id": end})
    logging.info("DONE — %d total saints (%d new)", len(saints), new_saints)


if __name__ == "__main__":
    main()
