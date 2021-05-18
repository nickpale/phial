from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from app.auth import login_required
from app.db import get_db

import uuid

bp = Blueprint('task', __name__)

@bp.route('/')
def index():
    db = get_db()
    tasks = db.execute(
        'SELECT taskID, title, description, createdDate, dueDate, duration, status, u.username'
        ' FROM task t JOIN user u ON t.userID = u.userID'
        ' ORDER BY createdDate DESC'
    ).fetchall()
    return render_template('task/index.html', tasks=tasks)

@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            taskID = str(uuid.uuid4())
            createdDate = '1900-01-01'
            dueDate = '1900-01-01'
            duration = '30'
            status = 'New'
            db = get_db()
            db.execute(
                'INSERT INTO task (taskID, title, description, createdDate, dueDate, duration, status, userID)'
                ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                (taskID, title, description, createdDate, dueDate, duration, status, g.user['userID'])
            )
            db.commit()
            return redirect(url_for('task.index'))

    return render_template('task/create.html')
