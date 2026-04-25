import socket

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect(('localhost', 12345))

op = input("Ingrese la operacion (ej: 'suma 5 3'): ")
client_socket.send(op.encode('utf-8'))

resultado = client_socket.recv(1024).decode('utf-8')
print(f'Resultado: {resultado}')
client_socket.close()