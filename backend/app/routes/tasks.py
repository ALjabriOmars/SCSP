from flask import Blueprint, request, jsonify
from app.models.task import Task
from app.db import db

task_bp = Blueprint("tasks", __name__)

@task_bp.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    new_task = Task(
        description=data["description"],
        department=data["department"],
        resources=data["resources"],
        timeline=data["timeline"],
        status="active"  
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@task_bp.route("/tasks", methods=["GET"])
def get_tasks():
    # Show both active and suspended tasks
    tasks = Task.query.filter(Task.status.in_(["active", "suspended"])).order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@task_bp.route("/tasks/<int:task_id>/status", methods=["PATCH"])
def update_task_status(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["active", "suspended", "terminated"]:
        return jsonify({"error": "Invalid status"}), 400

    if new_status == "terminated":
        db.session.delete(task)
    else:
        task.status = new_status

    db.session.commit()
    return jsonify({"message": f"Task {'deleted' if new_status == 'terminated' else f'updated to {new_status}'}"}), 200
