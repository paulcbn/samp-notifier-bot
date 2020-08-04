from flask import Flask

from config import FACTIONS_URL_RPG2
from service.parser import get_factions

app = Flask(__name__)


@app.route('/')
def factions_page():
    factions = get_factions(FACTIONS_URL_RPG2)
    return "[ "+",".join([faction.to_json() for faction in factions])+" ]"


if __name__ == "__main__":
    app.run(debug=True)
