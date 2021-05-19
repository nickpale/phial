from flask import Blueprint, jsonify

bp = Blueprint('hello', __name__, url_prefix='/hello')

@bp.route('/')
def hello():
    return jsonify({'data': 'Hello, World!'})
