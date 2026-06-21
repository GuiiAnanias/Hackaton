# Checklist de Integração do Painel Administrativo

## Objetivo

Este documento lista o que o painel administrativo precisa receber das outras partes do sistema para substituir os dados temporários por dados reais do banco.

A parte administrativa já possui controllers, services, DTOs, templates, validações e tratamento de erros preparados para integração futura.

## Rotas já preparadas no painel

* `/admin/login`
* `/admin/dashboard`
* `/admin/partidas`
* `/admin/ranking`
* `/admin/partidas/{id}/resultado`

## O que já está pronto na parte admin

* Tela visual de login administrativo
* Dashboard com resumo geral
* Dashboard com partidas pendentes
* Dashboard com últimos resultados
* Listagem de partidas
* Formulário de lançamento de resultado
* Ranking geral com paginação
* Critério de ordenação do ranking
* Mensagens de sucesso e erro
* Estados vazios para listas sem dados
* Tratamento global de erros
* Validação de placar no lançamento de resultado
* Estrutura de DTOs para comunicação entre services e telas

## Pontos que ainda usam dados temporários

Atualmente, os dados temporários estão centralizados em:

`AdminMockDataService`

Quando os repositories e services reais estiverem prontos, este service deve ser substituído por consultas reais ao banco.

## Integração necessária com autenticação e segurança

Responsável principal: Integrante 1

O painel administrativo precisa receber:

* Login real com Spring Security
* Proteção das rotas `/admin/**`
* Redirecionamento para `/admin/login` quando o usuário não estiver autenticado
* Controle de acesso por perfil `ADMIN`
* Bloqueio de acesso para usuários comuns
* Logout do painel administrativo
* Tratamento visual para acesso negado

## Integração necessária com usuários

Responsável principal: Integrante 2

O painel precisa de uma entidade de usuário com, no mínimo:

* `id`
* `nome`
* `email`
* `perfil`
* `bloqueado`
* `pontuacaoTotal`
* `placaresExatos`
* `ultimoAcesso`
* `criadoEm`

O ranking administrativo depende principalmente dos campos:

* `nome`
* `pontuacaoTotal`
* `placaresExatos`
* `criadoEm`

A ordenação esperada para o ranking é:

1. Maior pontuação total
2. Maior quantidade de placares exatos
3. Usuário cadastrado há mais tempo

## Integração necessária com partidas

Responsável principal: Integrante 2

O painel precisa de uma entidade de partida com, no mínimo:

* `id`
* `selecaoA`
* `selecaoB`
* `dataHora`
* `fase`
* `estadio`
* `grupo`
* `status`
* `golsSelecaoA`
* `golsSelecaoB`

A listagem administrativa de partidas depende dos campos:

* seleções envolvidas
* fase
* data e hora
* status
* resultado

O dashboard depende das partidas para exibir:

* partidas pendentes
* últimos resultados lançados
* total de partidas pendentes

## Integração necessária com seleções

Responsável principal: Integrante 2

As partidas precisam estar relacionadas com seleções cadastradas.

A entidade de seleção deve fornecer, no mínimo:

* `id`
* `nome`
* `codigoFifa`
* `bandeiraUrl`
* `grupo`

## Integração necessária com palpites

Responsáveis principais: Integrante 4 e Integrante 2

O painel precisa dos palpites para:

* calcular total de palpites no dashboard
* recalcular pontuação após lançamento de resultado
* atualizar ranking dos usuários
* identificar placares exatos

A entidade de palpite deve fornecer, no mínimo:

* `id`
* `usuario`
* `partida`
* `golsSelecaoA`
* `golsSelecaoB`
* `pontosObtidos`
* `criterioPontuacao`
* `criadoEm`
* `atualizadoEm`

## Integração necessária com lançamento de resultado

Responsáveis principais: Integrante 1 e Integrante 2

O fluxo visual já existe no painel, mas a persistência real ainda precisa ser integrada.

O service real deve fazer:

* buscar a partida pelo ID
* validar se a partida existe
* salvar os gols da partida
* alterar o status da partida para encerrada
* recalcular os pontos dos palpites relacionados
* atualizar a pontuação total dos usuários
* atualizar a quantidade de placares exatos
* executar o processo em transação
* retornar erro amigável se algo falhar

O método atual do painel que deve ser integrado futuramente é:

`AdminPartidaService.lancarResultado`

## Integração necessária com pontuação

Responsável principal: Integrante 1

A regra de pontuação esperada é:

* placar exato: 10 pontos
* acerto do vencedor ou empate: 5 pontos
* erro total: 0 pontos

Após lançar ou editar resultado, o sistema deve recalcular os palpites da partida e atualizar o ranking.

## Services do painel preparados para integração

Os principais services da parte admin são:

* `AdminDashboardService`
* `AdminPartidaService`
* `AdminRankingService`
* `AdminMockDataService`

O `AdminMockDataService` é temporário.

No futuro, os dados devem vir de:

* `UsuarioRepository`
* `PartidaRepository`
* `PalpiteRepository`
* `SelecaoRepository`
* `ResultadoService`
* `PontuacaoService`

## DTOs usados pelo painel

Os DTOs já preparados são:

* `DashboardResumoDTO`
* `PartidaAdminDTO`
* `PartidaResultadoDTO`
* `RankingLinhaDTO`
* `RankingPaginaDTO`
* `UsuarioRankingBaseDTO`

A integração deve tentar manter esses DTOs como saída para os templates, evitando colocar entidades diretamente nas telas.

## Tratamento de erro esperado

A parte admin já possui:

* `AdminException`
* `AdminExceptionHandler`
* `admin/erro.html`
* `error.html`

Os services reais podem lançar `AdminException` quando precisarem exibir uma mensagem amigável para o administrador.

Exemplos de erro que devem usar mensagem amigável:

* partida não encontrada
* usuário sem permissão
* resultado inválido
* erro ao salvar resultado
* erro ao recalcular pontuação
* dados obrigatórios ausentes

## Checklist final para integração

* Substituir dados do `AdminMockDataService` por repositories reais
* Proteger rotas `/admin/**` com perfil `ADMIN`
* Integrar `/admin/login` com autenticação real
* Integrar ranking com usuários reais
* Integrar dashboard com totais reais
* Integrar listagem de partidas com partidas reais
* Integrar lançamento de resultado com persistência no banco
* Integrar recálculo de pontuação
* Garantir transação no lançamento de resultado
* Manter mensagens amigáveis em caso de erro
* Testar painel com banco vazio
* Testar painel com dados reais
