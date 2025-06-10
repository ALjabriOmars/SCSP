# app/models/bid.py

from app.db import db
from datetime import datetime

class Bid(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, nullable=False)
    task_name = db.Column(db.String(200), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    provider_name = db.Column(db.String(100), nullable=False)
    bid_price = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="pending")
    resources = db.Column(db.String(200))
    reason = db.Column(db.String(200))
    completed_date = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "task": self.task_name,
            "department": self.department,
            "provider": self.provider_name,
            "bid": self.bid_price,
            "status": self.status,
            "resources": self.resources,
            "reason": self.reason,
            "completed_date": self.completed_date,
        }
