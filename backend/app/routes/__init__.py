from flask import Blueprint
from .auth import auth_bp
from .issues import issues_bp

api_bp = Blueprint("api", __name__)

api_bp.register_blueprint(auth_bp, url_prefix="/auth")
api_bp.register_blueprint(issues_bp, url_prefix="/issues")
