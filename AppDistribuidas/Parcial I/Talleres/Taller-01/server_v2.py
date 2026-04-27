import socket
import threading

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




def gestionar_cliente(client_socket, addr):
    print(f'Cliente conectado desde {addr} en hilo {threading.current_thread().name}')
    try:
        data = client_socket.recv(1024).decode('utf-8')
        if data:
            partes = data.strip.split()
            if len(partes) == 3:
                op,n1,n2 = partes
                try:
                    num1 = float(n1)
                    num2 = float(n2)
                    resultado = calculadora(op, num1, num2)
                    client_socket.send(str(resultado).encode('utf-8'))
                except:
                    client_socket.send("Error: numeros invalidos")
        else:
            client_socket.send("Error: Datos invalidos")
    except Exception as e:
        print(f'Error en hilo: {e}')
    finally:
        client_socket.close()
        print(f'Cliente {addr} desconectado.')

server_socket=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
PORT = 12346
server_socket.bind(('localhost',PORT))
server_socket.listen(5)
print("Servidor concurrente escando en el puerto 1234")

try:
    while True:
        client_socket, addr = server_socket.accept()
        hilo = threading.Thread(target=gestionar_cliente,args=(client_socket,addr))
        hilo.start()
except KeyboardInterrupt:
    print("Servidor detenido")
finally:
    server_socket.close()