import threading
import time

_messages = {}
_next_id = 1


def create_message(sender_sid, room, ttl_seconds):
    global _next_id
    msg_id = _next_id
    _next_id += 1
    expires_at = time.time() + ttl_seconds
    _messages[msg_id] = {
        'id': msg_id,
        'sender_sid': sender_sid,
        'room': room,
        'expires_at': expires_at
    }
    timer = threading.Timer(ttl_seconds, _messages.pop, args=[msg_id, None])
    timer.daemon = True
    timer.start()
    return _messages[msg_id]


def get_message(message_id):
    return _messages.get(message_id)
