from flask import Blueprint

bp = Blueprint('doigas', __name__, url_prefix='/doigas')

@bp.route('/')
def doigas():
    return 'Oh man, it\'s gettin juicy'
