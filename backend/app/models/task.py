from app.db import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    department = db.Column(db.String(50), nullable=False)
    resources = db.Column(db.Text, nullable=False)
    timeline = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Available")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "department": self.department,
            "resources": self.resources,
            "timeline": self.timeline,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
