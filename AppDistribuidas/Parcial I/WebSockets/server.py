from datetime import datetime

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mi_clave_secreta'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}

@app.route('/')
def index():
    return render_template('index.html') 

@socketio.on('connect')
def handle_connect():
    print(f'Cliente conectado:`{request.sid}`')
@socketio.on('set_username')
def handle_set_username(data):
    username = data.get('username','Anonimo')
    users[request.sid] = username
    emit('user_joined', {'username': username}, broadcast=True,include_self=False)
    emit('user_list', {"users": list(users.values())}, broadcast=True)

@socketio.on('chatMessage')
def handle_chat_message(data):
    username = users.get(request.sid, 'Anonimo')
    message = data.get('message', '')
    timestamp = datetime.now().strftime('%H:%M:%S')
    emit('chatMessage', {'username': username, 'message': message, "timestamp": timestamp}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    username = users.pop(request.sid, 'Anonimo')
    print(f'Cliente desconectado: {request.sid} ({username})')
    emit('user_left', {'username': username}, broadcast=True)
    emit("user_list",{"users": list(users.values())}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0" , port=5000, debug=True)