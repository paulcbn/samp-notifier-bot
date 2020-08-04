from dataclasses import dataclass
from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class Faction:
    name: str
    faction_type: str
    application_open: bool
    max_members: int
    members_count: int
    minimum_level: int
    application_closing_time: str
    current_number_of_applications: int
    max_applications: int
