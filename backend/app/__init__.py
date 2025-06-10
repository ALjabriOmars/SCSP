from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config
from .db import db

# Blueprint imports
from .routes import api_bp
from .routes.tasks import task_bp
from .routes.bids import bids_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Apply CORS globally before registering blueprints
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    db.init_app(app)

    with app.app_context():
        from .models.user import User
        from .models.issue import Issue
        from .models.task import Task
        from .models.bid import Bid
        db.create_all()

    # Register routes
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(task_bp, url_prefix="/api")
    app.register_blueprint(bids_bp, url_prefix="/api")

    return app
