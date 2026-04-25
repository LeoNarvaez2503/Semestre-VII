import socket

def calculadora(op, num1,num2):
    if op == 'suma':
        return num1+num2
    elif op == 'resta':
        return num1-num2
    elif op == 'producto':
        return num1*num2
    elif op == 'division' and num2 != 0:
        return num1/num2
    else:
        return 'Operacion no valida o division por cero'

server_socket=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('localhost', 12345))
server_socket.listen(1)
print('Servidor escuchando en el puerto 12345...')

try:
    while True:
        client_socket, addr = server_socket.accept()
        print(f'Cliente conectado desde {addr}')

        data = client_socket.recv(1024).decode('utf-8')
        if data:
            partes = data.split(',')
            if len(partes) == 3:
                op ,num1_str, num2_str = partes
                try:
                    num1 = float(num1_str)
                    num2 = float(num2_str)
                    resultado = calculadora(op, num1, num2)
                    client_socket.send(str(resultado).encode('utf-8'))
                except ValueError:
                    client_socket.send(b'Error: Numeros invalidos')
            else:
                client_socket.send(b'Error: Formato de datos incorrecto')
                client_socket.close()
        else:
            print("No se recibieron datos del cliente.")
            client_socket.close()

        
except KeyboardInterrupt:
    print('Servidor detenido por el usuario.')
finally:
    server_socket.close()
