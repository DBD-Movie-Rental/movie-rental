"""
customers.py — routes for customers.

Route map
---------
# Customers (CRUD)
GET    /customers
GET    /customers/<customer_id>
POST   /customers
PUT    /customers/<customer_id>
DELETE /customers/<customer_id>
"""

from repositories.mysql import customers_repository
from flask import jsonify
from . import bp

# ─────────────────────────────────────────────────────────────────────────────
# Customers (CRUD)
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/customers", methods=["GET"])
def get_customers():
    customers = customers_repository.get_all_customers()
    return jsonify(customers), 200  # empty list: still 200 OK


@bp.route("/customers/<int:customer_id>", methods=["GET"])
def get_customer(customer_id: int):
    customer = customers_repository.get_customer_by_id(customer_id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    return jsonify(customer), 200


@bp.route("/customers", methods=["POST"])
def create_customer():
    # TODO: Waiting for repo implementation for creating a new customer
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/customers/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    # TODO: Waiting for repo implementation for updating an existing customer
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/customers/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    ok = customers_repository.delete_customer(customer_id)
    if not ok:
        return jsonify({"error": "Customer not found"}), 404
    return jsonify({"message": "Customer deleted"}), 204
