from flask import Blueprint

bp = Blueprint("mysql_api", __name__, url_prefix="/api/v1/mysql")

# attach routes
from . import customers
from . import employee_ops
from . import inventory
from . import lookups
from . import movies
from . import rentals