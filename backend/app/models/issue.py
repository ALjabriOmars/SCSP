from app.db import db
from datetime import datetime

class Issue(db.Model):
    __tablename__ = "issues"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    department = db.Column(db.String(50), nullable=True) 
    status = db.Column(db.String(20), nullable=False, default="open") 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "description": self.description,
            "location": self.location,
            "department": self.department,
            "status": self.status, 
            "created_at": self.created_at.isoformat(),
        }
