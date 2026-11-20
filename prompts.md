# Registro de prompts do site da Xepa Certa (Front-end Design)

**Disciplina:** Front-end Design · **Responsável:** Henrique Lira (RM571009) · **Time:** SafeTech · GS CitizenTech 2026.2, FIAP

Registro dos pedidos feitos às ferramentas de IA durante o desenvolvimento do site, como pedem os combinados da GS (PDF, pág. 22). As cinco partes exigidas pela disciplina (ferramentas, interações, aplicação no projeto, validação e análise crítica) estão no [`AI.md`](AI.md).

A camada de regras, serviços e hooks (`src/domain`, `src/services`, `src/hooks`, `src/data`) pertence à parte de Web Development, de Daniel Gomes Torres (RM573436), e não é descrita aqui como trabalho do Front-end.

------------------------------------------------

## Registro das sessões

Os registros abaixo estão separados por etapa de desenvolvimento. Cada sessão traz o pedido feito ao Claude Code, o que a IA fez com o direcionamento de Henrique e como o resultado foi conferido. Os totais de testes em cada sessão são históricos; o total atual informado no README é 230.

### Etapa 1 · Planejamento e base do repositório

#### 11/11 · Primeira versão do Front a partir do plano (Claude Code)
- **Pedido:** construir a parte de Front-end a partir dos commits do repositório de Web, com a mesma lógica, os mesmos padrões de código e o mesmo processo de desenvolvimento; antes, fazer uma varredura completa dos PDFs da entrega; seguir o plano de Front-end tarefa por tarefa, com commits organizados, e verificar build, testes e fluxos antes de concluir.
- **O que a IA fez com o direcionamento de Henrique:**
  - Leu os oito PDFs da entrega e o histórico do `web_development`.
  - Implementou, tarefa por tarefa do plano, as cores e fontes, os 24 componentes e as onze telas, cada um com o teste ao lado.
  - Registrou 21 commits em conventional commits, em português.
  - Esta versão não foi publicada e passou a servir de inventário das telas para o redesenho de 17/11.
- **Como conferimos:** 240 testes passando; lint e build sem erro; percurso completo do CRUD no navegador, com uma cópia local do MockAPI; Lighthouse com 100 em acessibilidade nas dez rotas com conteúdo.

#### 17/11 · Planejamento do repositório do Front (Claude Code)
- **Pedido:** "Crie na organização citizentech-1ESPU um repositório só para o Front-end e devolva o `web_development` ao último commit da parte de Web, sem o Front. Antes de copiar qualquer código de Web para o repositório novo, confirme nos PDFs da GS e nos planos da equipe se as entregas de Front e de Web são ligadas, citando a página."
- **O que a IA fez com o direcionamento de Henrique:**
  - Criou o repositório público `front-end-design` e voltou o `web_development` ao commit `da0a395`.
  - Mostrou nos PDFs que a parte de Web é "o JavaScript que dá vida à interface, no mesmo repositório do Front-end" (pág. 57), e que o Front exige hooks personalizados, separação da lógica e CRUD numa API externa (págs. 41 e 42).
  - Com base nisso, Henrique decidiu copiar a camada de Web e ter um deploy próprio.
- **Como conferimos:** trechos dos PDFs lidos; `web_development` conferido no GitHub, de volta à página provisória.

#### 17/11 · Tarefa 1: Repositório novo com a camada de Web (Claude Code)
- **Pedido:** "Copie para o `front-end-design` a base do projeto e as pastas `domain`, `services`, `hooks`, `data` e `scripts` do `web_development@da0a395`, sem o README. Faça um commit por pasta e informe em cada commit que o código é de Daniel Gomes Torres e de onde veio. Pronto quando os testes da parte de Web passarem no repositório novo."
- **O que a IA fez com o direcionamento de Henrique:** copiou os arquivos em cinco commits, cada um com a origem e o autor do código no corpo da mensagem.
- **Como conferimos:** 144 testes da parte de Web passando no repositório novo.

### Etapa 2 · Identidade visual e componentes

#### 17/11 · Tarefa 2: Sistema visual da marca com a Hallmark (Claude Code)
- **Pedido:** "Use a skill Hallmark para um redesenho completo. A marca se mantém: leia as cores e as fontes do documento de design (seção 6.3) e da logo nova (pasta xepa-certa-logo, LEIA-ME) e passe tudo para tokens em OKLCH. Os estados da caixa (verde, amarelo, vermelho, azul do gelo) são sinais, não cor de destaque, e não mudam. Registre o selo da Hallmark no começo do CSS."
- **O que a IA fez com o direcionamento de Henrique:** executou o scaffold da Hallmark em modo marca e converteu as cores para OKLCH. Escreveu `tokens.css` com os nomes da Hallmark (`paper`, `ink`, `accent`, `rule`) e os estados da caixa, e o `globals.css` com o selo e a escala das telas do app. Carregou Archivo e Atkinson Hyperlegible pelo `next/font`.
- **Como conferimos:** build sem erro; nenhum valor de cor fora dos tokens.

#### 17/11 · Tarefa 3: Componentes no sistema novo (Claude Code)
- **Pedido:** "Redesenhe os componentes da primeira versão no sistema novo, sem mudar props nem a lógica. Siga as regras fixas da Hallmark: sem emoji no lugar de ícone, sem bolinha decorativa de status, sem faixa colorida na lateral do cartão, sem `transition: all`, borda dos campos com contraste de 3:1 e foco visível. Use a logo compacta no cabeçalho e a plaquinha amarela da logo no selo de Hora da xepa."
- **O que a IA fez com o direcionamento de Henrique:**
  - Retirou os emojis das telas, a bolinha do selo de estado e a faixa lateral do cartão da caixa.
  - Ajustou a animação do interruptor para mover apenas a posição e escureceu a borda dos campos.
  - Incluiu a logo no cabeçalho e criou a plaquinha inclinada de "Hora da xepa".
  - Corrigiu o estado de gelo, que havia ficado azul, de volta ao verde do LED.
- **Como conferimos:** 49 testes de componentes passando.

### Etapa 3 · Telas do app

#### 17/11 · Tarefa 4: Telas do app (Claude Code)
- **Pedido:** "Organize as onze telas numa coluna de celular, com o mesmo cabeçalho e a mesma barra de abas. Troque os textos unidos por ponto no meio por vírgula ou por linhas separadas. Não mude a lógica nem a ligação com os hooks. Se um teste falhar por causa de texto, mostre qual regra pediu a mudança antes de alterar o teste."
- **O que a IA fez com o direcionamento de Henrique:**
  - Agrupou as telas numa rota com a coluna de celular, sem mudar as URLs.
  - Substituiu os textos com ponto no meio e retirou o fundo branco dos cartões.
  - Dois testes esperavam "Banca Mar Azul · 350 m"; a IA indicou a regra correspondente (63) e ajustou o texto esperado.
- **Como conferimos:** testes das telas passando; telas abertas no navegador a 390 px.

### Etapa 4 · Landing, logo e imagens

#### 17/11 · Tarefa 5: Logo, fotos e capturas (Claude Code)
- **Pedido:** "Selecione na pasta da logo os arquivos adequados ao site, respeitando o tamanho mínimo do LEIA-ME. Busque na biblioteca da Hallmark fotos de feira com licença aberta, de preferência de São Paulo, com crédito. Capture as telas de feirante, freguês, ONG e do detalhe da oferta a partir do build de produção, com dados de demonstração."
- **O que a IA fez com o direcionamento de Henrique:**
  - Usou a logo compacta (52 px) no cabeçalho, a logo completa no rodapé e o pacote de ícones.
  - Selecionou uma foto de uma feira do bairro da Saúde, em São Paulo, otimizada para a web; após a revisão final, ela foi substituída por peixe no gelo.
  - Capturou as quatro telas no tamanho de celular.
  - Testou fotos por categoria nos cartões de oferta, constatou que não correspondiam aos produtos e as retirou.
- **Como conferimos:** capturas abertas uma a uma, sem dado pessoal e sem o indicador do modo de desenvolvimento.

#### 17/11 · Tarefa 6: Landing que apresenta a solução (Claude Code)
- **Pedido:** "Crie a landing em `/`. O objetivo da página é levar cada perfil a usar o site. No hero, o produto: as quatro caixas lidas pelo `useCaixas`. Em seguida:
  - a feira de hoje em comparação com a feira com a Xepa Certa;
  - as telas reais de cada perfil, em abas que funcionam sem JavaScript;
  - a fala do feirante, somente a liberada no documento de design;
  - a regra das 2 e 4 horas;
  - as três entradas, sem cadastro.

  Nenhum número, depoimento ou logo inventado. Até 80 palavras por tela."
- **O que a IA fez com o direcionamento de Henrique:**
  - Definiu a estrutura com a Hallmark: hero com texto e produto lado a lado, menu em pílula e rodapé em formato de carta.
  - Escreveu a página, o CSS com o selo e três componentes: o painel das caixas, a troca de perfil e a entrada por perfil, que guarda o perfil no navegador.
  - Escreveu 7 testes.
- **Como conferimos:** testes passando; landing conferida a 375 e a 1440 px; perfil guardado ao entrar.

### Etapa 5 · Verificação, revisão independente e responsividade

#### 17/11 · Tarefa 7: Verificação final (Claude Code)
- **Pedido:** "Execute o `sloplint` da Hallmark na landing e nas telas, no navegador. Corrija toda falha nas regras fixas. Dispense uma regra de reflexo somente com evidência e motivo registrados no CSS. Depois execute testes, lint e build."
- **O que a IA fez com o direcionamento de Henrique:** corrigiu as imagens que não carregavam, o texto encostado na borda, a entrelinha, a caixa dentro de caixa no diálogo e o lint, e registrou duas dispensas com motivo.
- **Como conferimos:** `sloplint` sem falha; 227 testes passando; lint limpo; build com a landing e as onze rotas.

#### 18/11 · Revisão final em contexto separado (Claude Code, agente de revisão)
- **Pedido:** "Leia as instruções de revisão final da Hallmark (`review-finish.md`) e siga-as. Você não acompanhou a construção da página. Receba as capturas da landing em 375, 1280, 1440 e 1920 px, as telas do app, o código da página e o selo do CSS. Responda com o veredito na primeira palavra e as correções, da mais cara para a mais barata, com arquivo e linha. Não altere nenhum arquivo."
- **O que a IA fez com o direcionamento de Henrique:**
  - O agente de revisão respondeu "fix" e apontou oito pontos, entre eles:
    - a seção dos perfis fraca, com a tela estreita e cortada no meio de um cartão;
    - a foto de pimentas, inadequada para uma solução voltada a peixe;
    - a logo repetida dentro das capturas;
    - os botões do fecho com larguras diferentes;
    - a tabela quebrando a 375 px;
    - espaço vazio no painel das caixas;
    - dois títulos genéricos.
  - Henrique solicitou a correção de todos. A IA:
    - recortou as telas abaixo do cabeçalho e num cartão inteiro, com um script próprio que oculta a barra de abas;
    - substituiu a foto por peixe no gelo;
    - incluiu em cada caixa do painel a ação recomendada;
    - igualou os botões do fecho;
    - corrigiu a tabela no celular;
    - trocou os títulos por "Feirante anuncia, freguês reserva, ONG retira" e "Abra no celular, ali na feira".
- **Como conferimos:** `sloplint` novamente no navegador, sem falha; 227 testes passando; lint e build sem erro; página inteira conferida a 1440 px.

#### 18/11 · Ajustes de responsividade (Claude Code)
- **Pedido:** "Abra a landing e as telas do app em 360, 414, 768, 1024 e 1440 px. Meça se alguma página rola para o lado e confira cada largura. No computador, as telas do app não podem ficar presas numa coluna de celular: use a largura da tela, organize as listas em grade e mantenha o celular como está."
- **O que a IA fez com o direcionamento de Henrique:**
  - Na landing, corrigiu:
    - a plaquinha que sobrepunha o nome da caixa a 1024 px;
    - a tabela que virava lista no tablet;
    - a altura da foto a 768 px;
    - os botões de larguras diferentes no celular.
  - Na página Sobre, separou a parte e o RM de cada integrante.
  - Após Henrique indicar as telas do app presas numa coluna estreita no computador, ampliou as telas até 72rem:
    - as listas passaram a grade de 2 ou 3 colunas;
    - o detalhe da oferta passou a duas colunas;
    - as abas foram para uma pílula no alto, à direita.
  - Arredondou o botão Entrar do menu.
  - Refez a captura da tela do freguês sem a linha de filtros cortada.
- **Como conferimos:** nenhuma rolagem para o lado em nenhuma largura; capturas em 375, 1024 e 1440 px conferidas uma a uma; 227 testes passando; `sloplint` sem falha.

### Etapa 6 · Publicação, CRUD real e acessibilidade

#### 18/11 · Publicação, CRUD real e acessibilidade (Claude Code e Claude in Chrome)
- **Pedido:** "Publique o site com a URL do MockAPI da equipe e confira, no site publicado, cada operação do CRUD diretamente na API. Depois execute o Lighthouse (celular, Acessibilidade) nas seis telas do plano, com meta de 95 ou mais, e gere prints de 360 x 740 das onze telas, medindo se alguma rola para o lado. Não apague dados da equipe; o que for criado no teste deve voltar ao estado anterior."
- **O que a IA fez com o direcionamento de Henrique:**
  - Levou a URL do MockAPI para o build (`.env.production`) e publicou o site na Vercel, na conta de Henrique.
  - Como as ofertas de demonstração estavam vencidas, recriou as seis pelo botão do próprio site, que apenas cria e não apaga dados.
  - No site publicado, reservou um item, editou uma oferta e cancelou a reserva, conferindo cada passo na API, e retornou a quantidade da oferta ao valor original.
  - Executou o Lighthouse: 97 na landing, 96 em "Suas caixas" e 100 nas outras quatro. Identificou a causa na etiqueta "Complete o gelo", que piscava inteira e ficava ilegível no meio do piscar. Escreveu o teste, fez apenas o ponto de LED piscar e publicou novamente: 100 nas seis.
  - Gerou os onze prints com a emulação de celular do Chrome e escreveu `docs/acessibilidade.md`, a seção "Componentes" do README e a atualização do `AI.md`.
- **Como conferimos:** 230 testes passando; lint limpo; Lighthouse refeito no site publicado; largura de 360 px medida em cada tela; com movimento reduzido, o ponto de LED para (`animation: none`); nenhuma reserva de teste remanescente na API.

### Etapa 7 · Documentação da entrega

#### 17/11 · Tarefa 8: README e registro de uso de IA (Claude Code)
- **Pedido:** "Escreva o README do repositório com a Ficha da CitizenTech no topo, as telas, onde está cada requisito da disciplina, a identidade visual, a acessibilidade e a instalação. Informe que a camada de Web é de Daniel Gomes Torres. Depois escreva o `prompts.md` no formato do registro de Python da equipe."
- **O que a IA fez com o direcionamento de Henrique:** escreveu o README e a primeira versão deste registro.
- **Como conferimos:** contagem de componentes e telas comparada com as pastas; número de testes conferido com `npm test`.

#### 19/11 · Padronização do registro de uso de IA (Claude Code)
- **Pedido:** revisar o `AI.md` e o `prompts.md` e padronizá-los no mesmo formato de organização do registro de Python da equipe (`computational-thinking-with-python`), com linguagem profissional e as sessões separadas por etapas de desenvolvimento.
- **O que a IA fez com o direcionamento de Henrique:** reorganizou o `AI.md` nas cinco partes pedidas pela disciplina (PDF, pág. 41), no mesmo formato do registro de Python, e deixou este arquivo com o registro completo dos pedidos, agrupados em sete etapas, com os rótulos Pedido, O que a IA fez com o direcionamento de Henrique e Como conferimos. Incluiu a sessão de 11/11, que não estava registrada.
- **Como conferimos:** cada sessão comparada com o histórico de commits do repositório; as cinco partes do `AI.md` conferidas com a pág. 41 do PDF; números de testes, componentes, telas e notas do Lighthouse conferidos com o README e `docs/acessibilidade.md`.
