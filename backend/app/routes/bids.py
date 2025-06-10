# app/routes/bids.py

from flask import Blueprint, request, jsonify, make_response
from app.models.bid import Bid
from app.db import db
from datetime import datetime

bids_bp = Blueprint("bids", __name__)

def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PATCH")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

@bids_bp.route("/bids", methods=["OPTIONS"])
def bids_preflight():
    response = make_response()
    return add_cors_headers(response), 200

@bids_bp.route("/bids", methods=["GET", "POST"])
def handle_bids():
    if request.method == "GET":
        department = request.args.get("department")
        provider = request.args.get("provider")
        try:
            if department:
                bids = Bid.query.filter_by(department=department).all()
            elif provider:
                bids = Bid.query.filter_by(provider_name=provider).all()
            else:
                bids = Bid.query.all()

            response = jsonify([bid.to_dict() for bid in bids])
            return add_cors_headers(response), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    if request.method == "POST":
        try:
            data = request.get_json()
            new_bid = Bid(
                task_id=data["taskId"],
                task_name=data["taskName"],
                provider_name=data["providerName"],
                bid_price=data["bidAmount"],
                department=data["department"],
                status="pending"  # default status on creation
            )
            db.session.add(new_bid)
            db.session.commit()
            response = jsonify({"message": "Bid submitted successfully"})
            return add_cors_headers(response), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@bids_bp.route("/bids/<int:bid_id>/status", methods=["PATCH"])
def update_bid_status(bid_id):
    try:
        data = request.get_json()
        status = data.get("status")
        reason = data.get("reason")
        completed_date = data.get("completed_date")

        bid = Bid.query.get(bid_id)
        if not bid:
            return jsonify({"error": "Bid not found"}), 404

        bid.status = status
        if reason:
            bid.reason = reason
        if completed_date:
            bid.completed_date = completed_date

        db.session.commit()
        response = jsonify({"message": "Bid status updated"})
        return add_cors_headers(response), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
