import requests
from bs4 import BeautifulSoup
import re

from domain.faction import Faction


def get_faction_type(title):
    return title.split()[0].lower()


def get_members_count(string):
    parts = string.split(" / ")
    return int(parts[0]), int(parts[1])


def get_level(string):
    matches = re.match(r"Level ([0-9]*)", string)
    return int(matches.group(1))


def is_open(string):
    if "lock_open" in string:
        return True
    return False


def get_applications(string):
    if string == "Not set":
        return None, None
    matches = re.match(r"([0-9]*) allowed \(([0-9]*) new\)", string)
    return int(matches.group(1)), int(matches.group(2))


def get_factions(factions_url):
    factions = []
    content = requests.get(factions_url).content
    soup = BeautifulSoup(content, 'html.parser')
    faction_tables = soup.findAll("div", {"class": "tableFull"})
    for faction_table in faction_tables:
        tab = faction_table.find("table")
        lines = tab.findAll("tr")
        faction_type = get_faction_type(lines[0].getText())
        for line in lines[2:]:
            cells = line.findAll("td")
            faction_name = cells[0].findAll("a")[-1].getText()
            members_count, max_members = get_members_count(cells[1].getText())
            level = get_level(cells[2].getText())
            faction_open = is_open(cells[3].getText())
            application_closing_time = cells[4].getText()
            max_applications, current_number_of_applications = get_applications(cells[5].getText())
            factions.append(Faction(faction_name, faction_type, faction_open, max_members, members_count, level,
                                    application_closing_time, current_number_of_applications, max_applications))
    return factions
