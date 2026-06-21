# Bolão Copa do Mundo 2026

Projeto desenvolvido para o Hackathon do 5º período do curso de Tecnologia em Sistemas para Internet.

O sistema consiste em um aplicativo de bolão para a Copa do Mundo 2026, onde usuários podem se cadastrar, realizar palpites nas partidas, acompanhar sua pontuação e visualizar o ranking geral.

## Estrutura do Projeto

O repositório será organizado da seguinte forma:

```txt
bolao-copa-2026/
    backend/
    mobile/
    docs/
    README.md
```

## Artefatos do Projeto

### Backend e Painel Admin Web

Responsável pela API REST, autenticação, regras de negócio, persistência de dados, painel administrativo web e cálculo de pontuação.

Tecnologias previstas:

```txt
Java 21
Spring Boot Web
Spring Security
JWT
Spring Data JPA
MySQL Driver
Thymeleaf
Bootstrap
Lombok
Spring Boot Dev Tools
Validation
```

### App Mobile

Responsável pela interface do usuário comum, incluindo cadastro, login, logout, edição de perfil, listagem de partidas, envio de palpites, histórico de palpites e visualização do ranking.

Tecnologias previstas:

```txt
React Native
API REST
JWT
```

### Banco de Dados

Responsável por armazenar usuários, seleções, partidas, palpites, resultados, pontuações e demais dados necessários para o funcionamento do sistema.

Tecnologia prevista:

```txt
MySQL
```

## Organização das Branches

O projeto utiliza um fluxo simples de branches para facilitar o desenvolvimento em equipe durante o hackathon.

## Branches Principais

### main

Branch principal do projeto.

Deve conter apenas a versão estável e pronta para apresentação.

Ninguém deve trabalhar diretamente na `main`.

### develop

Branch de integração do time.

Todas as funcionalidades prontas devem ser enviadas para a `develop` através de Pull Request.

A `develop` deve ser testada antes de ser enviada para a `main`.

## Branches dos Integrantes

Cada integrante deve trabalhar apenas na sua própria branch.

```txt
feature/i1-auth-jwt-pontuacao
feature/i2-crud-dados
feature/i3-mobile-auth-partidas
feature/i4-mobile-palpites
feature/i5-admin-dashboard-ranking
```

## Responsabilidades

### Integrante 1

Branch:

```txt
feature/i1-auth-jwt-pontuacao
```

Responsável por:

```txt
Setup do repositório
DevOps
Arquitetura base
Spring Security
JWT
Perfis ADMIN e USER
Login com retorno de token
Cálculo automático da pontuação
Regra oficial de pontuação
Consistência no recálculo de pontuação
```

### Integrante 2

Branch:

```txt
feature/i2-crud-dados
```

Responsável por:

```txt
CRUD de seleções
CRUD de partidas
Listagem de usuários
Visualização de usuários
Bloqueio e desbloqueio de usuários
Edição de resultado
Integração com MySQL via JPA
```

### Integrante 3

Branch:

```txt
feature/i3-mobile-auth-partidas
```

Responsável por:

```txt
Cadastro de usuário
Login no app
Recuperação de senha
Edição de perfil
Logout
Exclusão de conta
Listagem de partidas
Detalhes da partida
Filtros de partidas por data, fase e status
```

### Integrante 4

Branch:

```txt
feature/i4-mobile-palpites
```

Responsável por:

```txt
Destaque de próximas partidas
Registro de palpite
Edição de palpite
Bloqueio de palpite após início da partida
Listagem dos meus palpites
Visualização da pontuação individual do palpite
```

### Integrante 5

Branch:

```txt
feature/i5-admin-dashboard-ranking
```

Responsável por:

```txt
Login do painel admin
Painel administrativo web
Dashboard de indicadores
Lançamento de resultado
Ranking geral
Posição do usuário no ranking
Paginação do ranking
Critério de desempate do ranking
```

## Fluxo de Trabalho

Antes de começar a trabalhar, atualize a branch `develop`:

```bash
git checkout develop
git pull origin develop
```

Depois entre na sua branch:

```bash
git checkout nome-da-sua-branch
```

Atualize sua branch com a `develop`:

```bash
git merge develop
```

Depois de fazer alterações, verifique os arquivos modificados:

```bash
git status
```

Adicione os arquivos alterados:

```bash
git add .
```

Crie um commit:

```bash
git commit -m "feat: descricao da alteracao"
```

Envie para o GitHub:

```bash
git push
```

## Pull Request para a Develop

Quando uma funcionalidade estiver pronta, abra um Pull Request da sua branch para a `develop`.

Exemplo:

```txt
feature/i5-admin-dashboard-ranking -> develop
```

No GitHub:

```txt
Pull requests
New pull request
base: develop
compare: feature/i5-admin-dashboard-ranking
Create pull request
```

Depois da revisão, o Pull Request pode ser enviado para a `develop`.

## Pull Request para a Main

Quando a `develop` estiver testada e funcionando, será aberto um Pull Request da `develop` para a `main`.

```txt
develop -> main
```

A `main` deve representar a versão final e estável do projeto para apresentação.

## Padrão de Commits

Utilizar mensagens simples e objetivas.

```txt
feat: nova funcionalidade
fix: correção de erro
style: alteração visual
docs: documentação
refactor: reorganização de código
chore: configuração
```

Exemplos:

```bash
git commit -m "feat(admin): cria dashboard"
git commit -m "feat(ranking): adiciona criterio de desempate"
git commit -m "fix(auth): corrige validacao de login"
git commit -m "style(admin): ajusta layout do painel"
git commit -m "docs: adiciona fluxo de trabalho com git"
```

## Regras do Projeto

```txt
Ninguém deve fazer push direto na main
Cada integrante deve trabalhar na sua própria branch
Toda entrega deve passar por Pull Request para a develop
A main só deve ser atualizada quando a develop estiver funcionando
Antes de abrir Pull Request, a branch deve ser atualizada com a develop
Funcionalidade quebrada não deve ser enviada para a main
```

## Fluxo Final

```txt
feature/... -> develop -> main
```

A versão da `main` será usada como versão final para apresentação.

## Comandos para Criar a Develop

```bash
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

## Comandos para Criar as Branches dos Integrantes

### Integrante 1

```bash
git checkout develop
git checkout -b feature/i1-auth-jwt-pontuacao
git push -u origin feature/i1-auth-jwt-pontuacao
```

### Integrante 2

```bash
git checkout develop
git checkout -b feature/i2-crud-dados
git push -u origin feature/i2-crud-dados
```

### Integrante 3

```bash
git checkout develop
git checkout -b feature/i3-mobile-auth-partidas
git push -u origin feature/i3-mobile-auth-partidas
```

### Integrante 4

```bash
git checkout develop
git checkout -b feature/i4-mobile-palpites
git push -u origin feature/i4-mobile-palpites
```

### Integrante 5

```bash
git checkout develop
git checkout -b feature/i5-admin-dashboard-ranking
git push -u origin feature/i5-admin-dashboard-ranking
```

## Como Cada Integrante Deve Entrar na Própria Branch

Depois de clonar o projeto:

```bash
git clone URL_DO_REPOSITORIO
cd bolao-copa-2026
git fetch --all
```

Entrar na branch correspondente:

```bash
git checkout nome-da-sua-branch
```

Exemplo do Integrante 5:

```bash
git checkout feature/i5-admin-dashboard-ranking
```

## Checklist Antes de Abrir Pull Request

```txt
Atualizei minha branch com a develop
Testei minha parte
Fiz commits com mensagens claras
Enviei minha branch para o GitHub
Conferi se o Pull Request está indo para a develop
```

## Checklist Antes de Enviar para a Main

```txt
A develop está rodando
O backend inicia sem erro
O app mobile não quebrou por alterações do backend
O banco está com as tabelas necessárias
O fluxo principal da apresentação foi testado
O Pull Request está indo de develop para main
```

## Combinado do Time

O objetivo do Git neste projeto é evitar bagunça e permitir que cada integrante trabalhe na sua parte sem quebrar a parte dos outros.

A regra principal é:

```txt
Trabalhar na própria branch
Enviar para develop por Pull Request
Enviar para main apenas quando estiver estável.
```
