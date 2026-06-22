# Como rodar backend Java + mobile Android

## 1. Backend no IntelliJ

Abra `Hackaton/backend` pelo `pom.xml` e rode a classe:

`br.com.bolao.backend.BackendApplication`

O backend precisa ficar ativo em:

`http://localhost:8080`

Usuario de teste:

- E-mail: `joao@email.com`
- Senha: `senha123`

## 2. Mobile no VS Code

Abra `Hackaton/mobile` no VS Code.

Instale as dependencias, se ainda nao instalou:

```bash
npm install
```

Rode no Android Emulator:

```bash
npm run android
```

No Android Emulator, o app acessa o backend pelo endereco:

`http://10.0.2.2:8080`

Esse endereco ja esta configurado em `api.ts`.

## 3. Fluxo esperado

1. O app abre na tela de login.
2. O login chama `POST /api/auth/login`.
3. O cadastro chama `POST /api/auth/cadastro`.
4. A recuperacao de senha chama `POST /api/auth/recuperar-senha`.
5. A lista de partidas chama `GET /api/partidas`.
6. Os detalhes da partida chamam `GET /api/partidas/{id}`.
7. Editar perfil chama `PATCH /api/usuarios/me` com token JWT.
8. Excluir conta chama `DELETE /api/usuarios/me` com token JWT.
9. Salvar palpite chama `POST /api/palpites` com token JWT.
10. Meus palpites chama `GET /api/palpites/me` com token JWT.
