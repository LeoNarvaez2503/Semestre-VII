import os
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
templates_dir = os.path.join(base_dir, 'templates')
static_dir = os.path.join(base_dir, 'static')

app = Flask(__name__, template_folder=templates_dir, static_folder=static_dir)
app.config['SECRET_KEY'] = 'mi_clave_secreta'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
