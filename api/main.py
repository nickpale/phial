import os
import awsgi
from app import create_app

app = create_app(os.getenv('FLASK_CONFIG') or 'default')


def handler(event, context):
    return awsgi.response(app, event, context, base64_content_types={"image/png"})
