from datetime import datetime
from flask import request
from flask_socketio import emit, join_room, leave_room
from .config import socketio
from .users import add_user, remove_user, get_username, get_all_users, is_username_taken, get_room
from .messages import create_message, get_message

@socketio.on('connect')
def handle_connect():
    print(f'Cliente conectado: {request.sid}')

@socketio.on('set_username')
def handle_set_username(data):
    username = (data.get('username') or '').strip()
    room = (data.get('room') or '').strip()
    if not username:
        emit('username_rejected', {'reason': 'Ingrese un nickname valido.'})
        return
    if not room:
        emit('username_rejected', {'reason': 'Ingrese una sala valida.'})
        return
    if is_username_taken(username, room, exclude_sid=request.sid):
        emit('username_rejected', {'reason': 'Ese nickname ya esta en uso en la sala.'})
        return
    add_user(request.sid, username, room)
    join_room(room)
    emit('username_accepted', {'username': username, 'room': room})
    emit('user_joined', {'username': username}, to=room, include_self=False)
    emit('user_list', {'users': get_all_users(room)}, to=room)

@socketio.on('chatMessage')
def handle_chat_message(data):
    username = get_username(request.sid)
    room = get_room(request.sid)
    if not room:
        return
    message = data.get('message', '')
    ttl_seconds = int(data.get('ttl_seconds') or 10)
    if ttl_seconds not in (10, 60, 300):
        ttl_seconds = 10
    timestamp = datetime.now().strftime('%H:%M:%S')
    msg = create_message(request.sid, room, ttl_seconds)
    emit('chatMessage', {
        'id': msg['id'],
        'username': username,
        'message': message,
        'timestamp': timestamp,
        'ttl_seconds': ttl_seconds
    }, to=room)

@socketio.on('readMessage')
def handle_read_message(data):
    message_id = data.get('message_id')
    username = get_username(request.sid)
    room = get_room(request.sid)
    if message_id is None:
        return
    msg = get_message(message_id)
    if not msg:
        return
    if msg['room'] != room:
        return
    if msg['sender_sid'] == request.sid:
        return
    emit('messageRead', {'message_id': message_id, 'username': username}, to=msg['sender_sid'])

@socketio.on('disconnect')
def handle_disconnect():
    info = remove_user(request.sid)
    username = info.get('username', 'Anonimo')
    room = info.get('room', '')
    print(f'Cliente desconectado: {request.sid} ({username})')
    if room:
        leave_room(room)
        emit('user_left', {'username': username}, to=room)
        emit('user_list', {'users': get_all_users(room)}, to=room)
