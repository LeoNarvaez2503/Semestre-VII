users = {}

def add_user(sid, username):
    users[sid] = username

def remove_user(sid):
    return users.pop(sid, 'Anonimo')

def get_username(sid):
    return users.get(sid, 'Anonimo')

def get_all_users():
    return list(users.values())
