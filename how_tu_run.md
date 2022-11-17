## Execução do Projeto

### Execução através de script

Para rodar o código através do script de inicialização basta:

```
bash run.sh 
```

A partir disso é possível acessar a url: `localhost:8080` e utilizar a aplicação.

### Execução manual

Navegue até a pasta `app/` e rode o comando:

```
docker build -t server .
```

Volte para a raiz e rode o comando:

```
docker-compose up
```