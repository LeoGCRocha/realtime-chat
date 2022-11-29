# Como executar o projeto

## Requisitos

A execução do projeto depende dos seguintes programas:

- Docker
- Docker Compose

## Execução

Para executar o projeto, basta executar o script `run.sh` por meio do `bash`. Note que talvez seja necessário ter privilégios de super usuário.

```
bash run.sh
```

Este script irá compilar a imagem do servidor de aplicação e subir todos os serviçoes definidos no arquivo de configuração do Docker Compose.

Após isto, basta acessar o navegador no endereço `http://localhost:8080`.