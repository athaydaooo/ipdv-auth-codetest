# IPDV Auth Codetest

## 📝 Sobre o Projeto

Este projeto é um sistema de autenticação que suporta múltiplos papéis de usuário (multi roles), permitindo o controle de acesso baseado em diferentes níveis de permissão. Ele foi desenvolvido para facilitar a gestão de usuários com funções distintas, como administradores, usuários comuns e outros perfis personalizados, garantindo segurança e flexibilidade na autenticação e autorização das aplicações.

## ⚙️ Configuração de Variáveis de Ambiente

Antes de iniciar o desenvolvimento ou executar os projetos, é fundamental preencher corretamente os arquivos `.env` de cada um deles. Esses arquivos contêm variáveis de ambiente essenciais para o funcionamento das aplicações, como chaves de API, URLs de serviços e configurações sensíveis.

Verifique a existência de um arquivo `.env.example` em cada projeto para saber quais variáveis precisam ser definidas. Copie esse arquivo para `.env` e preencha os valores conforme necessário. Sem essa configuração, os projetos podem não funcionar corretamente ou apresentar erros inesperados.

## 🐳 Executando os serviços

Para rodar o projeto utilizando Docker Compose, siga os passos abaixo:

1. Certifique-se de que o Docker e o Docker Compose estão instalados em sua máquina.
2. No diretório raiz do projeto, execute o comando:

    ```bash
    docker-compose up
    ```

3. Aguarde até que todos os serviços estejam em execução. O projeto estará disponível conforme configurado no `docker-compose.yml`.

Para parar os containers, utilize:

```bash
docker-compose down
```

## 🤝 Como Contribuir
1. Fork este repositório
2. Crie uma branch com sua feature: git checkout -b minha-feature
3. Commit suas alterações: git commit -m 'feat: nova funcionalidade'
4. Push para sua branch: git push origin minha-feature
5. Abra um Pull Request
6. Utilize pnpm lint e pnpm test antes de subir suas mudanças.

## 📄 Licença
Este projeto está licenciado sob os termos da MIT License.
