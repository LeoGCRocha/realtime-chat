# Como executar o projeto

## Instalação de dependêcias

Para execução do projeto são necessárias as seguintes dependências:

*node.js*: para o desenvolvimento e execução do projeto

*redis-server*: servidor para o Message Broker 

## Inicializando  o servidor do Message Broker

```redis-server --daemonize yes```

## Execução do Projeto

Para execução do projeto inicialmente iremos inicializar os servidores que irá possibilitar a comunicação dos clientes.

Como a ideia do trabalho é mostrar a comunicação de *Websockets* e *Message Broker*, criamos dois servidores em portas difernetes para demonstrar a comunicação através do adaptador.

Para isso deve-se executar os seguintes comandos:

```
npm install
```

Para, que as dependências para execução do trabalho sejam instaladas e dessa forma possam executar corretamente.

Para próxima etapa deve-se iniciar dois servidores distintos para comunicação de multiplos clientes.

```
node server.js
```

Inicializa um servidor na porta 8080.

```
node server.js 5000
```
Inicializa um servidor na porta 5000.

Em sequência já é possível conectar os clientes com os servidores para que possam enviar mensagens.

Cliente 1:
```
localhost:8080?username=joaopedro&group=distribuida
```

Cliente 2: 
```
localhost:5000?username=leonardo&group=distribuida
```

# TODO: Apesar das mensagens estarem indo para um canal compartilhado a contagem de usuários não está funcionando corretamente.