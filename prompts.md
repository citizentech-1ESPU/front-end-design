# Uso de IA no site da Xepa Certa (Front-end Design)

Registro do uso de Inteligência Artificial no desenvolvimento do site, organizado nas cinco partes pedidas pela FIAP (PDF, pág. 41). Henrique Lira (RM571009) conduziu o trabalho: definiu os objetivos, as restrições e o material de referência, solicitou cada etapa e aprovou os resultados. As ferramentas de IA atuaram como apoio técnico no planejamento, na implementação e na revisão. Onde o registro informa que a IA escreveu código ou testes, essa autoria fica explícita.

A camada de regras, serviços e hooks (`src/domain`, `src/services`, `src/hooks`, `src/data`) pertence à parte de Web Development, de Daniel Gomes Torres (RM573436), e não é descrita aqui como trabalho do Front-end.

------------------------------------------------

## 1. Ferramentas e finalidades

- **Claude Code** (assistente de programação da Anthropic, usado no terminal, dentro da pasta do projeto): principal ferramenta de implementação. Leu os PDFs da entrega e o documento de design, montou o repositório, escreveu componentes, telas, landing e testes, executou testes, lint e build e registrou os commits.
- **Hallmark** (skill de design de código aberto, da Together AI, instalada no Claude Code): conjunto de regras de design verificáveis (cores e fontes em tokens, ícones no lugar de emojis, foco visível, contraste) e de scripts que:
  - definem a estrutura da página;
  - buscam fotos com licença aberta;
  - capturam as telas reais do site;
  - verificam a página no navegador, em larguras de 375 a 1920 px (`sloplint`).
- **Agente de revisão** (Claude Code, em contexto separado): nova instância, sem o histórico da construção, usada para revisar a página pronta de forma independente.
- **Claude in Chrome** (extensão do Claude para o navegador): usada para percorrer o CRUD no site publicado, com o MockAPI real da equipe.
- **Forma de trabalho:** Henrique definiu o problema, as restrições (manter as cores dos estados da caixa, o tom de voz e as onze telas) e o material (a logo do time e fotos de feira com licença aberta). A IA propôs o plano, implementou e verificou cada etapa. As decisões de Henrique estão na seção 2.

## 2. Prompts, decisões e direcionamento

Decisões de Henrique, por data:

- **11/11:** construir a primeira versão do Front a partir do plano de Front-end (`03-front-lira.pdf`) e do histórico do repositório de Web, com varredura completa dos PDFs antes da implementação.
- **17/11:** manter o site do Front num repositório próprio da organização (`front-end-design`) e devolver o `web_development` ao último commit da parte de Web. O Front passa a ter deploy próprio.
- **17/11:** copiar para o repositório novo a camada de regras, serviços e hooks da parte de Web, depois de confirmar nos PDFs que as duas entregas são ligadas.
- **17/11:** refazer o Front com a Hallmark, preservando as cores dos estados da caixa (as mesmas do LED, do painel e do site), o tom de voz de feira, as onze telas e a ligação com os hooks.
- **17/11:** o site deve apresentar a solução, como uma landing, e não abrir apenas nas telas de uso. Usar a logo nova do time e fotos de feira com licença aberta.
- **18/11:** corrigir todos os pontos apontados na revisão independente e abrir as telas do app na largura do computador.
- **18/11:** publicar o site com o MockAPI da equipe e conferir o CRUD no site publicado, sem apagar dados da equipe.
- **19/11:** padronizar este registro no mesmo formato do registro de Python da equipe, separado por etapas de desenvolvimento.

Todos os pedidos seguiram a mesma estrutura:
- **Contexto:** onde está o material.
- **Fonte de verdade:** o documento de design, os PDFs e a logo.
- **Tarefa:** uma única tarefa por pedido.
- **Restrições:** o que não pode mudar.
- **Critério de pronto:** testes, lint, build e `sloplint` sem falha.

## 3. Funcionalidades feitas, sugeridas ou modificadas com IA

- **Implementadas pela IA a partir das decisões de Henrique:**
  - a landing (`/`), com:
    - as quatro caixas ao vivo no hero;
    - a comparação entre a feira de hoje e a feira com a Xepa Certa;
    - a troca de perfil com as telas reais;
    - a fala do feirante entrevistado;
    - a tabela da regra das 2 e 4 horas;
    - as três entradas, sem cadastro;
  - o sistema visual da marca em tokens (`tokens.css`, `base.css`, `globals.css`);
  - os 27 componentes de `src/components/`;
  - as onze telas do app, em coluna de celular no telefone e em grade no computador;
  - os testes da landing, dos componentes e das telas;
  - o README, a revisão de acessibilidade (`docs/acessibilidade.md`) e os prints de 360 px (`docs/prints/`).
- **Sugestões da IA incorporadas ao projeto:**
  - mostrar no hero o produto funcionando (as caixas lidas do ThingSpeak), em vez de uma ilustração;
  - usar a plaquinha amarela da logo como selo de "Hora da xepa";
  - ilustrar a landing com capturas das telas reais do site;
  - citar a única fala literal liberada da entrevista com o feirante (documento de design, seção 2);
  - trocar o ponto no meio dos textos ("Banca Mar Azul · 350 m") por vírgula ("Banca Mar Azul, a 350 m").
- **Modificadas depois da conferência:**
  - as fotos por categoria saíram das telas do app, porque mostravam um produto diferente do anunciado;
  - o estado "Complete o gelo" voltou para o verde, que é a cor do LED no documento de design;
  - a foto da landing passou de pimentas para peixe no gelo;
  - as capturas foram recortadas abaixo do cabeçalho do app;
  - os botões do diálogo de exclusão perderam a borda;
  - a etiqueta "Complete o gelo" deixou de piscar inteira: agora só o ponto de LED pisca e o texto fica firme.

## 4. Como verificamos, testamos e ajustamos

- **Testes automatizados:** 230 testes passando (Vitest e Testing Library), incluindo os 7 testes da landing e os 3 do piscar da etiqueta. Cobrem o único `h1` por tela, as ações do hero, as quatro caixas, os estados de carregando e erro, a tabela da regra, a gravação do perfil e as abas com as setas do teclado.
- **Lint e build:** `npm run lint` sem erro e `npm run build` gerando a landing e as onze rotas estáticas.
- **No navegador:**
  - o site foi executado com uma cópia local do MockAPI, fora do repositório, e com as seis ofertas de demonstração;
  - a caixa 1 leu o ThingSpeak real (canal 3571880);
  - as capturas das telas foram feitas a partir do build de produção;
  - no site publicado, com o MockAPI real da equipe, as operações de criar, reservar, editar e cancelar foram conferidas diretamente na API.
- **Lighthouse (celular, Acessibilidade):** 100 nas seis telas do plano, depois da correção do piscar (antes, 97 na landing e 96 em "Suas caixas"). Detalhes em `docs/acessibilidade.md`.
- **Verificação de design (`sloplint` da Hallmark):** landing e telas abertas no navegador em 375, 1024, 1280, 1440 e 1920 px. Resultado final sem falhas nas regras fixas. Duas regras foram dispensadas com o motivo registrado no CSS: a altura do cartão de oferta, que é um botão grande de propósito, e o estado desativado do cartão da caixa.
- **Revisão independente:** um agente sem o histórico da conversa revisou a página e apontou oito correções, todas aplicadas (etapa 5).
- **Erros encontrados e ajustes:**

| Problema | Como apareceu | O que foi feito |
|---|---|---|
| Foto de laranja na oferta de banana | capturas das telas | fotos por categoria retiradas das telas do app |
| "Complete o gelo" em azul | leitura do documento de design | volta ao verde do LED |
| Indicador do modo de desenvolvimento nas capturas | capturas das telas | capturas refeitas a partir do build de produção |
| Imagens da landing sem carregar | `sloplint` no navegador | capturas incluídas antes do build; build refeito |
| Texto encostado na borda a 375 px | `sloplint` no navegador | aspas penduradas da citação desligadas no celular |
| Entrelinha apertada na assinatura do rodapé | `sloplint` no navegador | ajuste de 1,25 para 1,3 |
| Caixa dentro de caixa no diálogo de exclusão | `sloplint` | botões do diálogo sem borda |
| Testes esperando "Banca Mar Azul · 350 m" | `npm test` | texto e testes atualizados para "Banca Mar Azul, a 350 m" |
| `setState` dentro de `useEffect` | `npm run lint` | substituição por `useSyncExternalStore` |
| Download das fotos recusado (erro 429) | download no Wikimedia | tamanhos padrão de miniatura e identificação do cliente |
| "Complete o gelo" ilegível no meio do piscar (contraste 1,5:1) | Lighthouse no site publicado | apenas o ponto de LED pisca; o texto fica firme |
| Print de 360 px cortado | Chrome sem interface no Windows | prints refeitos com a emulação de celular do Chrome |

## 5. Análise crítica

- **Benefícios:**
  - A Hallmark trouxe regras de design verificáveis: cada problema apareceu com local e motivo, e o `sloplint` confirmou a correção no navegador.
  - As capturas das telas reais tornaram a landing fiel ao produto, sem ilustrações que não correspondem ao site.
  - Dividir o trabalho em etapas curtas, com critério de pronto definido, prendeu cada erro à etapa em que surgiu.
- **Limitações:**
  - O código e os testes foram escritos pela IA; por isso, o estudo de cada parte por Henrique é parte da preparação para a apresentação.
  - A revisão do hero antes do restante da página, também recomendada pela Hallmark, não foi feita; a revisão final apontou os pontos que ela teria identificado.
  - Ficam como próximas conferências manuais: navegação somente com teclado, leitor de tela (NVDA), zoom de 200% e uso em celular físico.
- **Dificuldades:**
  - As fotos por categoria, que pareciam adequadas, não correspondiam aos produtos das ofertas e foram retiradas.
  - O servidor local do build bloqueou a pasta de saída, e a verificação passou a usar outro caminho.
  - A padronização dos textos sem ponto no meio exigiu atualizar também os testes que esperavam o texto anterior.

---

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
- **Pedido:** revisar o `prompts.md` e padronizá-lo no mesmo formato de organização do registro de Python da equipe (`computational-thinking-with-python`), com linguagem profissional e as sessões separadas por etapas de desenvolvimento.
- **O que a IA fez com o direcionamento de Henrique:** reorganizou este arquivo nas cinco seções do registro de Python, agrupou as sessões em sete etapas, uniformizou os rótulos (Pedido, O que a IA fez com o direcionamento de Henrique, Como conferimos) e incluiu a sessão de 11/11, que não estava registrada.
- **Como conferimos:** cada sessão comparada com o histórico de commits do repositório; números de testes, componentes, telas e notas do Lighthouse conferidos com o README, o `AI.md` e `docs/acessibilidade.md`.
