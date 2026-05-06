from flask import render_template
from .config import app, socketio
from . import events  # noqa: F401

@app.route('/')
def index():
    return render_template('index.html')

def run():
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

if __name__ == '__main__':
    run()
