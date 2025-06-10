from flask import Blueprint, request, jsonify
from app.models.issue import Issue
from app.db import db

issues_bp = Blueprint("issues", __name__)

DEPARTMENT_TYPES = ["Waste", "Water", "Transport", "Energy", "Safety"]
VALID_STATUSES = ["open", "resolved"]

@issues_bp.route("/report", methods=["POST"])
def report_issue():
    data = request.get_json()
    issue_type = data.get("type")
    description = data.get("description")
    location = data.get("location")

    if not issue_type or not description or not location:
        return jsonify({"error": "Missing fields"}), 400

    department = issue_type if issue_type in DEPARTMENT_TYPES else None

    new_issue = Issue(
        type=issue_type,
        description=description,
        location=location,
        department=department,
        status="open"
    )
    db.session.add(new_issue)
    db.session.commit()

    return jsonify({"message": "Issue reported successfully"}), 201


@issues_bp.route("/", methods=["GET"])
def get_issues_by_department():
    department = request.args.get("department")
    status = request.args.get("status")

    query = Issue.query

    if department:
        query = query.filter_by(department=department)

    if status:
        if status not in VALID_STATUSES:
            return jsonify({"error": "Invalid status"}), 400
        query = query.filter_by(status=status)

    issues = query.order_by(Issue.created_at.desc()).all()
    return jsonify([issue.to_dict() for issue in issues]), 200


@issues_bp.route("/<int:issue_id>/resolve", methods=["PATCH"])
def resolve_issue(issue_id):
    issue = Issue.query.get(issue_id)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    issue.status = "resolved"
    db.session.commit()
    return jsonify({"message": "Issue marked as resolved"}), 200


@issues_bp.route("/<int:issue_id>", methods=["DELETE"])
def delete_issue(issue_id):
    issue = Issue.query.get(issue_id)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    db.session.delete(issue)
    db.session.commit()
    return jsonify({"message": "Issue deleted"}), 200
