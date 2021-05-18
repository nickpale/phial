import os

from config import config
from flask import Flask

from . import hello
from . import auth
from . import db
from . import task

def create_app(config_name):
    ''' create and configure the app '''
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    app.register_blueprint(hello.bp)
    # app.register_blueprint(auth.bp)
    # app.register_blueprint(task.bp)

    # db.init_app(app)

    app.add_url_rule('/', endpoint='index')

    return app
