"""
inventory.py — routes for inventory items, formats, and locations.

Route map
---------
# Inventory Items
GET    /inventory
GET    /inventory/<item_id>
POST   /inventory
PUT    /inventory/<item_id>
DELETE /inventory/<item_id>

# Formats
GET    /formats
GET    /formats/<format_id>
POST   /formats
PUT    /formats/<format_id>
DELETE /formats/<format_id>

# Locations
GET    /locations
GET    /locations/<location_id>
POST   /locations
PUT    /locations/<location_id>
DELETE /locations/<location_id>
"""

from flask import jsonify, request
from repositories.mysql import inventory_repository
from . import bp

# ─────────────────────────────────────────────────────────────────────────────
# Inventory Items
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/inventory", methods=["GET"])
def list_inventory_items():
    inventory_items = inventory_repository.get_all_inventory()
    return inventory_items, 200

@bp.route("/inventory/<int:item_id>", methods=["GET"])
def get_inventory_item(item_id: int):
    inventory_item = inventory_repository.get_inventory_by_id(item_id)
    if not inventory_item:
        return jsonify({"error": "Inventory item not found"}), 404
    return jsonify(inventory_item), 200

@bp.route("/inventory", methods=["POST"])
def create_inventory_item():
    # body = request.get_json(silent=True) or {}
    # TODO: repo.create_inventory(body)
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/inventory/<int:item_id>", methods=["PUT"])
def update_inventory_item(item_id: int):
    # body = request.get_json(silent=True) or {}
    # TODO: repo.update_inventory(item_id, body)
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/inventory/<int:item_id>", methods=["DELETE"])
def delete_inventory_item(item_id: int):
    ok = inventory_repository.delete_inventory(item_id)
    if not ok:
        return jsonify({"error": "Inventory item not found"}), 404
    return jsonify({"message": "Inventory item deleted"}), 204


# ─────────────────────────────────────────────────────────────────────────────
# Formats
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/formats", methods=["GET"])
def list_formats():
    formats = inventory_repository.list_formats()
    return jsonify(formats), 200

@bp.route("/formats/<int:format_id>", methods=["GET"])
def get_format(format_id: int):
    format = inventory_repository.get_format_by_id(format_id)
    if not format:
        return jsonify({"error": "Format not found"}), 404
    return jsonify(format), 200

@bp.route("/formats", methods=["POST"])
def create_format():
    # body = request.get_json(silent=True) or {}
    # TODO: repo.create_format(body)
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/formats/<int:format_id>", methods=["PUT"])
def update_format(format_id: int):
    # body = request.get_json(silent=True) or {}
    # TODO: repo.update_format(format_id, body)
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/formats/<int:format_id>", methods=["DELETE"])
def delete_format(format_id: int):
    ok = inventory_repository.delete_format(format_id)
    if not ok:
        return jsonify({"error": "Format not found"}), 404
    return jsonify({"message": "Format deleted"}), 204


# ─────────────────────────────────────────────────────────────────────────────
# Locations
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/locations", methods=["GET"])
def list_locations():
    locations = inventory_repository.list_locations()
    return jsonify(locations), 200

@bp.route("/locations/<int:location_id>", methods=["GET"])
def get_location(location_id: int):
    location = inventory_repository.get_location_by_id(location_id)
    if not location:
        return jsonify({"error": "Location not found"}), 404
    return jsonify(location), 200

@bp.route("/locations", methods=["POST"])
def create_location():
    # body = request.get_json(silent=True) or {}
    # TODO: repo.create_location(body)
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/locations/<int:location_id>", methods=["PUT"])
def update_location(location_id: int):
    # body = request.get_json(silent=True) or {}
    # TODO: repo.update_location(location_id, body)
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/locations/<int:location_id>", methods=["DELETE"])
def delete_location(location_id: int):
    ok = inventory_repository.delete_location(location_id)
    if not ok:
        return jsonify({"error": "Location not found"}), 404
    return jsonify({"message": "Location deleted"}), 204