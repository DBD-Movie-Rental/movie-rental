from . import bp
from flask import request, jsonify
from repositories.mysql import customer_repository, employee_repository

@bp.route("/login", methods=["POST"])
def login():
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/register", methods=["POST"])
def register():
    return jsonify({"todo": "implement"}), 501  # Not Implemented

@bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"todo": "implement"}), 501  # Not Implemented