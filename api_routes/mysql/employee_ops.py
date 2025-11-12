"""
employee_ops.py — routes for employees, overdue rentals, and health check.

Route map
---------
# Employees (CRUD)
GET    /employees
GET    /employees/<employee_id>
POST   /employees
PUT    /employees/<employee_id>
DELETE /employees/<employee_id>

# Overdue Rentals
GET    /overdue

# Health
GET    /health
"""

from flask import jsonify
from . import bp
from repositories.mysql import employee_repository

# ─────────────────────────────────────────────────────────────────────────────
# Employees (CRUD)
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/employees", methods=["GET"])
def get_employees():
    employees = employee_repository.get_all_employees()
    return jsonify(employees), 200


@bp.route("/employees/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):
    employee = employee_repository.get_employee_by_id(employee_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify(employee), 200


@bp.route("/employees", methods=["POST"])
def create_employee():
    # TODO: Implement repository call to create employee
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/employees/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):
    # TODO: Implement repository call to update employee
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    ok = employee_repository.delete_employee(employee_id)
    if not ok:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify({"message": "Employee deleted"}), 204

# ─────────────────────────────────────────────────────────────────────────────
# Overdue Rentals
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/overdue", methods=["GET"])
def get_overdue():
    overdue_rentals = employee_repository.get_overdue_rentals()
    return jsonify(overdue_rentals), 200

# ─────────────────────────────────────────────────────────────────────────────
# Health
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/health", methods=["GET"])
def get_health():
    # TODO: Implement repository call to get health status
    return jsonify({"todo": "implement"}), 501  # Not Implemented
