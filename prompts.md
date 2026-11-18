# Uso de IA no site da Xepa Certa (Front-end Design)

Registro da parceria com a IA no desenvolvimento do site, com as cinco partes pedidas pela FIAP. Henrique Lira (Front-end Design) conduziu o trabalho: definiu o que precisava mudar, decidiu o que ficava da marca e das telas, escolheu a logo e as referências e aprovou cada etapa. As ferramentas de IA atuaram como parceiras técnicas no planejamento, na implementação e na revisão. Onde os registros dizem que a IA escreveu código ou testes, essa autoria fica explícita.

A camada de regras, serviços e hooks (`src/domain`, `src/services`, `src/hooks`, `src/data`) é da parte de Web Development (Daniel Gomes Torres) e não entra aqui como trabalho de Henrique.

## 1. Ferramentas e finalidades

- **Claude Code** (assistente de programação da Anthropic, usado no terminal, dentro da pasta do projeto): principal parceiro de implementação. Leu os PDFs da entrega e o documento de design, montou o repositório, escreveu os componentes, as telas, a landing e os testes, rodou testes, lint e build e fez os commits.
- **Hallmark** (skill de design aberta, da Together AI, instalada no Claude Code): guiou o redesenho. Traz um conjunto de regras contra o visual "feito por IA" (cores e fontes sempre em tokens, sem emoji no lugar de ícone, sem rótulo em caixa alta espaçada, foco visível, contraste) e scripts que:
  - sorteiam a estrutura da página;
  - buscam fotos com licença aberta;
  - capturam as telas reais do site;
  - verificam a página no navegador, em larguras de 375 a 1920 px (`sloplint`).
- **Como foi o pair programming:** Henrique definiu o problema ("o front não apresenta a solução"), as restrições (manter as cores dos estados da caixa, o tom de voz e as telas) e o material (a logo nova e fotos de feira com licença aberta). A IA propôs o plano, implementou e verificou. As decisões de Henrique estão na seção 2; as sugestões da IA ficam para a revisão dele. A revisão manual completa de Henrique ainda está pendente, por isso este registro não afirma que ele conferiu cada linha.

## 2. Prompts, decisões e direcionamento

Decisões de Henrique, por data:

- **17/11:** manter o site do Front num repositório próprio da organização (`front-end-design`) e devolver o `web_development` ao último commit da parte de Web. O Front terá um deploy próprio.
- **17/11:** copiar para o repositório novo a camada de regras, serviços e hooks da parte de Web, depois de confirmar nos PDFs que as duas entregas são ligadas.
- **17/11:** refazer o Front por completo com a Hallmark. Ficam as cores dos estados da caixa (as mesmas do LED, do painel e do site), o tom de voz de feira, as onze telas e a ligação com os hooks.
- **17/11:** o site precisa apresentar a solução, como uma landing, e não só abrir nas telas de uso. Usar a logo nova do time e fotos de feira com licença aberta.
- **17/11:** registrar o uso de IA neste arquivo, no mesmo formato do registro de Python da equipe.

Os prompts de cada sessão seguem o mesmo formato:
- **Contexto:** onde está o material.
- **Fonte de verdade:** o documento de design, os PDFs, a logo.
- **Tarefa:** uma só por prompt.
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
  - os 27 componentes redesenhados em `src/components/`;
  - as onze telas do app, numa coluna de celular;
  - os testes da landing;
  - o README.
- **Sugestões da IA, a confirmar na revisão de Henrique:**
  - mostrar no hero o próprio produto funcionando (as caixas lidas do ThingSpeak), em vez de uma ilustração;
  - usar a plaquinha amarela da logo como selo de "Hora da xepa" nas telas;
  - ilustrar a landing com capturas das telas reais do site, tiradas do app rodando;
  - citar a única fala literal liberada da entrevista com o feirante (documento de design, seção 2);
  - trocar o ponto no meio dos textos ("Banca Mar Azul · 350 m") por vírgula ("Banca Mar Azul, a 350 m").
- **Modificadas depois da conferência:**
  - as fotos por categoria saíram das telas do app: a oferta de banana aparecia com foto de laranjas e a de tilápia com foto de outro peixe;
  - o estado "Complete o gelo" voltou para verde, porque no documento de design o LED do gelo é verde piscando;
  - os botões do diálogo de exclusão perderam a borda, para não formar uma caixa dentro de outra;
  - o texto da comparação foi enxugado, para caber em uma tela de leitura.

## 4. Como verificamos, testamos e ajustamos

- **Testes automáticos:** 227 testes passando (Vitest e Testing Library), incluindo 7 testes novos da landing. Eles cobrem o único `h1`, as ações do hero, as quatro caixas, os estados de carregando e erro, a tabela da regra, a gravação do perfil e as abas com as setas do teclado.
- **Lint e build:** `npm run lint` sem erro e `npm run build` gerando a landing e as onze rotas estáticas.
- **No navegador:**
  - o site rodou com uma imitação local do MockAPI, fora do repositório, e com as seis ofertas de demonstração;
  - a caixa 1 leu o ThingSpeak de verdade (canal 3571880);
  - as capturas das telas foram feitas a partir do build de produção.
- **Verificação de design (`sloplint` da Hallmark):** a landing e as telas foram abertas no navegador a 375, 1280, 1440 e 1920 px. Resultado final: nenhuma falha nas regras fixas e nenhuma regra de reflexo em aberto. Duas regras ficaram dispensadas, com o motivo registrado no CSS: a altura do cartão de oferta, que é um botão grande de propósito, e o estado desativado do cartão da caixa.
- **Erros e ajustes:**

| Problema | Como apareceu | O que foi feito |
|---|---|---|
| Foto de laranja na oferta de banana | capturas das telas | fotos por categoria retiradas das telas do app |
| "Complete o gelo" em azul | leitura do documento de design | volta ao verde do LED |
| Indicador do modo dev nas capturas | capturas das telas | capturas refeitas a partir do build de produção |
| Imagens da landing sem carregar | `sloplint` no navegador | as capturas entraram depois do build; build refeito |
| Texto colado na borda a 375 px | `sloplint` no navegador | aspas penduradas da citação desligadas no celular |
| Entrelinha apertada na assinatura do rodapé | `sloplint` no navegador | de 1,25 para 1,3 |
| Caixa dentro de caixa no diálogo de exclusão | `sloplint` | botões do diálogo sem borda |
| Testes esperando "Banca Mar Azul · 350 m" | `npm test` | texto e testes passaram para "Banca Mar Azul, a 350 m" |
| `setState` dentro de `useEffect` | `npm run lint` | troca por `useSyncExternalStore` |
| Download das fotos recusado (erro 429) | download das fotos do Wikimedia | tamanhos padrão de miniatura e identificação do cliente |

- **Revisão em contexto separado:** um agente novo, sem o histórico da conversa, revisou a página pelas instruções da Hallmark e pediu correções (veja a sessão de 18/11).
- **Ainda falta conferir à mão:** Lighthouse, navegação só com teclado, leitor de tela (NVDA), zoom de 200% e o site no celular.

## 5. Análise crítica

- **Benefícios:**
  - A Hallmark deu ao redesenho regras verificáveis em vez de gosto: cada problema veio com o lugar e o motivo, e o `sloplint` confirmou a correção no navegador.
  - Capturar as telas reais deixou a landing honesta: ela mostra o produto, não um desenho dele.
  - Dividir o trabalho em sessões curtas deixou cada erro preso a uma etapa.
- **Limitações:**
  - A IA escreveu o código e os testes, então Henrique precisa estudar cada parte para explicar na apresentação.
  - As ofertas foram conferidas com uma imitação do MockAPI, e não com o serviço real, cuja URL fica com a parte de Web.
  - A revisão do hero antes do resto da página, que a Hallmark também recomenda, não foi feita; a revisão final apontou o que ela teria pego.
  - As conferências à mão ainda estão pendentes.
- **Dificuldades:**
  - As fotos de categoria pareciam boa ideia até aparecerem ao lado de produtos que não eram os delas.
  - O servidor que servia o build travou a pasta e precisou de outro caminho.
  - A regra de não ter ponto no meio dos textos exigiu mudar também os testes que esperavam o texto antigo.

---

## Registro das sessões

Os registros abaixo descrevem o prompt de cada etapa, o que a IA fez com o direcionamento de Henrique e como o resultado foi conferido.

### 17/11 · Planejamento do repositório do Front (Claude Code)
- **Prompt:** "Crie na organização citizentech-1ESPU um repositório só para o Front-end e devolva o `web_development` ao último commit da parte de Web, sem o Front. Antes de copiar qualquer código de Web para o repositório novo, confirme nos PDFs da GS e nos planos da equipe se as entregas de Front e de Web são ligadas, citando a página."
- **O que a IA fez com o direcionamento de Henrique:**
  - Criou o repositório público `front-end-design` e voltou o `web_development` ao commit `da0a395`. A primeira versão do Front ficou guardada numa branch local, como inventário das telas.
  - Mostrou nos PDFs que a parte de Web é "o JavaScript que dá vida à interface, no mesmo repositório do Front-end" (pág. 57).
  - Mostrou também que o Front exige hooks personalizados, separação da lógica e CRUD numa API externa (págs. 41 e 42).
  - Henrique decidiu copiar a camada de Web e ter um deploy próprio.
- **Como conferimos:** trechos dos PDFs lidos; `web_development` conferido no GitHub, com o site antigo de volta à página provisória.

### 17/11 · Tarefa 1: Repositório novo com a camada de Web (Claude Code)
- **Prompt:** "Copie para o `front-end-design` a base do projeto e as pastas `domain`, `services`, `hooks`, `data` e `scripts` do `web_development@da0a395`, sem o README. Faça um commit por pasta e diga em cada commit que o código é de Daniel Gomes Torres e de onde veio. Pronto quando os testes da parte de Web passarem no repositório novo."
- **O que a IA fez com o direcionamento de Henrique:** copiou os arquivos em cinco commits, cada um com a origem e o autor do código no corpo.
- **Como conferimos:** 144 testes da parte de Web passando no repositório novo.

### 17/11 · Tarefa 2: Sistema visual da marca com a Hallmark (Claude Code)
- **Prompt:** "Use a skill Hallmark para um redesenho completo. A marca fica: leia as cores e as fontes do documento de design (seção 6.3) e da logo nova (pasta xepa-certa-logo, LEIA-ME) e passe tudo para tokens em OKLCH. Os estados da caixa (verde, amarelo, vermelho, azul do gelo) são sinais, não cor de destaque, e não mudam. Escreva o selo da Hallmark no começo do CSS."
- **O que a IA fez com o direcionamento de Henrique:** rodou o scaffold da Hallmark em modo marca e converteu as cores para OKLCH. Escreveu `tokens.css` com os nomes da Hallmark (`paper`, `ink`, `accent`, `rule`) e os estados da caixa, e o `globals.css` com o selo e a escala das telas do app. Carregou Archivo e Atkinson Hyperlegible pelo `next/font`.
- **Como conferimos:** build sem erro; nenhum valor de cor solto fora dos tokens.

### 17/11 · Tarefa 3: Componentes no sistema novo (Claude Code)
- **Prompt:** "Redesenhe os componentes da primeira versão no sistema novo, sem mudar props nem a lógica. Siga as regras fixas da Hallmark: sem emoji no lugar de ícone, sem bolinha decorativa de status, sem faixa colorida na lateral do cartão, sem `transition: all`, borda dos campos com contraste de 3:1 e foco visível. Use a logo compacta no cabeçalho e a plaquinha amarela da logo no selo de Hora da xepa."
- **O que a IA fez com o direcionamento de Henrique:**
  - Tirou os emojis das telas, a bolinha do selo de estado e a faixa lateral do cartão da caixa.
  - Trocou a animação do interruptor para mexer só na posição e escureceu a borda dos campos.
  - Pôs a logo no cabeçalho e criou a plaquinha inclinada para "Hora da xepa".
  - Corrigiu o gelo, que tinha ficado azul, de volta para o verde do LED.
- **Como conferimos:** 49 testes de componentes passando.

### 17/11 · Tarefa 4: Telas do app (Claude Code)
- **Prompt:** "Ponha as onze telas numa coluna de celular, com o mesmo cabeçalho e a mesma barra de abas. Troque os textos juntados com ponto no meio por vírgula ou por linhas separadas. Não mude a lógica nem a ligação com os hooks. Se um teste falhar por causa de texto, mostre qual regra pediu a mudança antes de mexer no teste."
- **O que a IA fez com o direcionamento de Henrique:**
  - Pôs as telas num grupo de rotas com a coluna de celular, sem mudar as URLs.
  - Trocou os textos com ponto no meio e tirou o fundo branco dos cartões.
  - Dois testes esperavam "Banca Mar Azul · 350 m". A IA mostrou a regra (63) e ajustou o texto esperado.
- **Como conferimos:** testes das telas passando; telas abertas no navegador a 390 px.

### 17/11 · Tarefa 5: Logo, fotos e capturas (Claude Code)
- **Prompt:** "Escolha na pasta da logo os arquivos que servem ao site, respeitando o tamanho mínimo do LEIA-ME. Busque na biblioteca da Hallmark fotos de feira com licença aberta, de preferência de São Paulo, com crédito. Capture as telas de feirante, freguês, ONG e do detalhe da oferta a partir do build de produção, com dados de demonstração."
- **O que a IA fez com o direcionamento de Henrique:**
  - Usou a logo compacta (52 px) no cabeçalho, a logo com barbante no rodapé e o pacote de ícones.
  - Achou uma foto de uma feira da Saúde, em São Paulo, e reduziu o tamanho dela para a web. Depois da revisão final, ela foi trocada por peixe no gelo, mais perto do produto.
  - Capturou as quatro telas no tamanho de celular.
  - Testou fotos por categoria nos cartões de oferta, viu que não batiam com os produtos e as retirou.
- **Como conferimos:** capturas abertas uma a uma, sem dado pessoal e sem o indicador do modo dev.

### 17/11 · Tarefa 6: Landing que apresenta a solução (Claude Code)
- **Prompt:** "Crie a landing em `/`. O trabalho da página é levar cada perfil a usar o site. No hero, o produto: as quatro caixas lidas pelo `useCaixas`. Depois:
  - a feira de hoje contra a feira com a Xepa Certa;
  - as telas reais de cada perfil em abas que funcionam sem JavaScript;
  - a fala do feirante, só a liberada no documento de design;
  - a regra das 2 e 4 horas;
  - as três entradas, sem cadastro.

  Nenhum número, depoimento ou logo inventado. Até 80 palavras por tela."
- **O que a IA fez com o direcionamento de Henrique:**
  - Sorteou a estrutura com a Hallmark: hero com texto e produto lado a lado, menu em pílula e rodapé em forma de carta.
  - Escreveu a página, o CSS com o selo e três componentes: o painel das caixas, a troca de perfil e a entrada por perfil, que guarda o perfil no navegador.
  - Escreveu 7 testes.
- **Como conferimos:** testes passando; a landing vista a 375 e a 1440 px; o perfil guardado ao entrar.

### 17/11 · Tarefa 7: Verificação final (Claude Code)
- **Prompt:** "Rode o `sloplint` da Hallmark na landing e nas telas, no navegador. Corrija toda falha nas regras fixas. Dispense uma regra de reflexo só com evidência e motivo escritos no CSS. Depois rode testes, lint e build."
- **O que a IA fez com o direcionamento de Henrique:** corrigiu as imagens que não carregavam, o texto colado na borda, a entrelinha, a caixa dentro de caixa no diálogo e o lint. Registrou duas dispensas com motivo.
- **Como conferimos:** `sloplint` sem falha; 227 testes passando; lint limpo; build com a landing e as onze rotas.

### 17/11 · Tarefa 8: README e registro de uso de IA (Claude Code)
- **Prompt:** "Escreva o README do repositório com a Ficha da CitizenTech no topo, as telas, onde está cada requisito da disciplina, a identidade visual, a acessibilidade e a instalação. Diga que a camada de Web é de Daniel Gomes Torres. Depois escreva este `prompts.md` no formato do registro de Python da equipe."
- **O que a IA fez com o direcionamento de Henrique:** escreveu o README e este registro.
- **Como conferimos:** contagem de componentes e telas comparada com as pastas; números de testes conferidos com `npm test`. Revisão final de Henrique pendente.

### 18/11 · Revisão final em contexto separado (Claude Code, agente de revisão)
- **Prompt:** "Leia as instruções de revisão final da Hallmark (`review-finish.md`) e siga. Você não viu a construção da página. Receba as capturas da landing em 375, 1280, 1440 e 1920 px, as telas do app, o código da página e o selo do CSS. Responda com a primeira palavra do veredito e as correções, da mais cara para a mais barata, com arquivo e linha. Não altere nenhum arquivo."
- **O que a IA fez com o direcionamento de Henrique:**
  - O agente de revisão respondeu "fix" e apontou oito pontos. Os principais foram:
    - a seção dos perfis fraca, com a tela estreita e cortada no meio de um cartão;
    - a foto de pimentas, que não combina com uma solução para peixe;
    - a logo repetida dentro das capturas;
    - os botões do fecho com larguras diferentes;
    - a tabela quebrando a 375 px;
    - espaço vazio no painel das caixas;
    - dois títulos genéricos.
  - Henrique pediu para corrigir todos. A IA:
    - recortou as telas abaixo do cabeçalho e num cartão inteiro, com um script próprio que esconde a barra de abas;
    - trocou a foto por peixe no gelo;
    - escreveu em cada caixa do painel o que fazer;
    - igualou os botões do fecho;
    - corrigiu a tabela no celular;
    - trocou os títulos por "Feirante anuncia, freguês reserva, ONG retira" e "Abra no celular, ali na feira".
- **Como conferimos:** `sloplint` de novo no navegador, sem falha; 227 testes passando; lint e build ok; página inteira vista a 1440 px.
