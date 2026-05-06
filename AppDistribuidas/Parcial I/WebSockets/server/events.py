from datetime import datetime
from flask import request
from flask_socketio import emit
from .config import socketio
from .users import add_user, remove_user, get_username, get_all_users

@socketio.on('connect')
def handle_connect():
    print(f'Cliente conectado: {request.sid}')

@socketio.on('set_username')
def handle_set_username(data):
    username = data.get('username', 'Anonimo')
    add_user(request.sid, username)
    emit('user_joined', {'username': username}, broadcast=True, include_self=False)
    emit('user_list', {'users': get_all_users()}, broadcast=True)

@socketio.on('chatMessage')
def handle_chat_message(data):
    username = get_username(request.sid)
    message = data.get('message', '')
    timestamp = datetime.now().strftime('%H:%M:%S')
    emit('chatMessage', {'username': username, 'message': message, 'timestamp': timestamp}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    username = remove_user(request.sid)
    print(f'Cliente desconectado: {request.sid} ({username})')
    emit('user_left', {'username': username}, broadcast=True)
    emit('user_list', {'users': get_all_users()}, broadcast=True)
