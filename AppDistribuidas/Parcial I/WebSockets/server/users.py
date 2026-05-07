users = {}

def _normalize_username(username):
    return (username or '').strip().lower()

def _normalize_room(room):
    return (room or '').strip()

def add_user(sid, username, room):
    users[sid] = {
        'username': username,
        'room': room
    }

def remove_user(sid):
    return users.pop(sid, {'username': 'Anonimo', 'room': ''})

def get_username(sid):
    return users.get(sid, {}).get('username', 'Anonimo')

def get_room(sid):
    return users.get(sid, {}).get('room', '')

def get_all_users(room):
    normalized_room = _normalize_room(room)
    return [info['username'] for info in users.values() if info.get('room') == normalized_room]

def is_username_taken(username, room, exclude_sid=None):
    normalized = _normalize_username(username)
    if not normalized:
        return False
    normalized_room = _normalize_room(room)
    for sid, info in users.items():
        if exclude_sid and sid == exclude_sid:
            continue
        if info.get('room') != normalized_room:
            continue
        if _normalize_username(info.get('username')) == normalized:
            return True
    return False
