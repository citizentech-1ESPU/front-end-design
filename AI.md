# AI.md · Uso de Inteligência Artificial no site da Xepa Certa

**Disciplina:** Front-end Design · **Responsável:** Henrique Lira (RM571009) · **Time:** SafeTech · GS CitizenTech 2026.2, FIAP

Este arquivo documenta como as ferramentas de IA foram usadas no Front-end do site, nas cinco partes pedidas pela disciplina:
1. Ferramentas utilizadas
2. Interações realizadas
3. Aplicação no projeto
4. Validação das respostas
5. Análise crítica

O registro completo, sessão por sessão, com o texto de cada prompt, está em [`prompts.md`](prompts.md).

A camada de regras, serviços e hooks (`src/domain`, `src/services`, `src/hooks`, `src/data`) é da parte de Web Development (Daniel Gomes Torres). Ela veio do repositório `web_development` e não é descrita aqui como trabalho do Front.

## 1. Ferramentas utilizadas

| Ferramenta | O que é | Para que foi usada |
|---|---|---|
| **Claude Code** (Anthropic) | assistente de programação no terminal, dentro da pasta do projeto | ler os PDFs e o documento de design, montar o repositório, escrever componentes, telas, landing e testes, rodar testes, lint e build, fazer os commits |
| **Hallmark** (skill aberta da Together AI, instalada no Claude Code) | regras de design contra o visual "feito por IA" e scripts de apoio | guiar o redesenho; sortear a estrutura da landing; buscar fotos com licença aberta; capturar as telas reais do site; verificar a página no navegador em várias larguras (`sloplint`) |
| **Agente de revisão** (Claude Code, em contexto separado) | uma nova instância da IA, sem o histórico da construção | revisar a página pronta com olhos novos, pelas instruções de revisão da Hallmark |

Henrique conduziu o trabalho:
- definiu o problema, as restrições e o material (a logo do time e fotos de feira com licença aberta);
- pediu cada etapa;
- conferiu os resultados no navegador;
- decidiu os ajustes.

A IA implementou e verificou. Onde este arquivo diz que a IA escreveu código ou testes, essa autoria fica explícita.

## 2. Interações realizadas

Os prompts seguiram um formato fixo:
- **Contexto:** onde está o material.
- **Fonte de verdade:** o documento de design, os PDFs, a logo.
- **Tarefa:** uma só por prompt.
- **Restrições:** o que não pode mudar.
- **Critério de pronto:** testes, lint, build e `sloplint` sem falha.

Exemplos representativos:

**Confirmar antes de copiar código de outra parte**
> "Antes de copiar qualquer código de Web para o repositório novo, confirme nos PDFs da GS e nos planos da equipe se as entregas de Front e de Web são ligadas, citando a página."

*Resposta:* a IA mostrou que o PDF define a parte de Web como "o JavaScript que dá vida à interface, no mesmo repositório do Front-end" (pág. 57). Mostrou também que o Front exige hooks personalizados e CRUD numa API externa (págs. 41 e 42). Com isso, a camada de Web foi copiada com crédito ao autor.

**Manter a marca no redesenho**
> "A marca fica: leia as cores e as fontes do documento de design (seção 6.3) e da logo nova e passe tudo para tokens. Os estados da caixa (verde, amarelo, vermelho, azul do gelo) são sinais, não cor de destaque, e não mudam."

*Resposta:* tokens em OKLCH com a paleta da logo, as fontes Archivo e Atkinson Hyperlegible e os estados da caixa preservados. Num primeiro momento, a IA pôs o estado "gelo" em azul. Na conferência com o documento de design, ele voltou para o verde, que é a cor do LED.

**A landing que apresenta a solução**
> "Crie a landing em `/`. No hero, o produto: as quatro caixas lidas pelo `useCaixas`. Depois:
> - a feira de hoje contra a feira com a Xepa Certa;
> - as telas reais de cada perfil;
> - a fala do feirante liberada no documento de design;
> - a regra das 2 e 4 horas;
> - as três entradas.
>
> Nenhum número, depoimento ou logo inventado."

*Resposta:* a landing com:
- as caixas ao vivo, com a caixa 1 lida do ThingSpeak;
- uma tabela de antes e depois;
- abas por perfil com capturas reais do app;
- a citação do feirante;
- a tabela da regra;
- os botões de entrada.

**Revisão por um agente separado**
> "Leia as instruções de revisão final da Hallmark e siga. Você não viu a construção da página. Responda com o veredito e as correções, da mais cara para a mais barata, com arquivo e linha."

*Resposta:* "fix", com oito pontos. Os principais:
- a seção dos perfis estava fraca;
- a foto de pimentas não combinava com uma solução para peixe;
- a logo aparecia repetida dentro das capturas;
- os botões do fecho tinham larguras diferentes.

Todos os oito foram corrigidos.

**Responsividade**
> "No computador, as telas do app não podem ficar presas numa coluna de celular: use a largura da tela, ponha as listas em grade e mantenha o celular como está."

*Resposta:*
- telas até 72rem;
- listas em 2 ou 3 colunas;
- detalhe da oferta em duas colunas;
- abas no alto, no computador.

## 3. Aplicação no projeto

**Desenvolvido com auxílio da IA:**
- **Landing (`/`):** `src/app/page.jsx`, `src/app/landing.css` e os componentes de `src/components/landing/`.
- **Sistema visual da marca:** `src/app/tokens.css`, `base.css` e `globals.css`.
- **27 componentes** em `src/components/`. Os principais:
  - o cartão da caixa, com a plaquinha amarela de "Hora da xepa";
  - o cartão de oferta, o cabeçalho com a logo e as abas por perfil;
  - os formulários, os estados de vazio, carregando e erro, o diálogo de confirmação e o aviso.
- **As 11 telas do app** em `src/app/(app)/`.
- **Testes:** os 7 testes da landing e os testes de componentes e telas, junto com os testes da parte de Web (227 no total).
- **Documentação:** o `README.md`, este arquivo e o `prompts.md`.

**Sugerido pela IA e mantido:**
- mostrar no hero o produto funcionando, e não uma ilustração;
- usar a plaquinha da logo como selo de "Hora da xepa";
- ilustrar a landing com capturas das telas reais do site;
- trocar os textos com ponto no meio ("Banca Mar Azul · 350 m") por vírgula.

**Modificado depois da conferência:**
- as fotos por categoria saíram das telas do app, porque mostravam um produto diferente do da oferta;
- a foto da landing trocou de pimentas para peixe no gelo;
- as capturas foram recortadas abaixo do cabeçalho do app;
- as telas do app ganharam a largura do computador.

## 4. Validação das respostas

- **Testes automáticos:** 227 testes passando (Vitest e Testing Library), com `npm run lint` limpo e `npm run build` gerando a landing e as 11 rotas.
- **No navegador:**
  - o site rodou com uma imitação local do MockAPI e ofertas de demonstração;
  - a caixa 1 leu o ThingSpeak de verdade (canal 3571880);
  - os fluxos de anunciar e de reservar foram percorridos.
- **Verificação de design:** o `sloplint` da Hallmark abriu as páginas em 375, 1024, 1280, 1440 e 1920 px. Mediu contraste, foco, áreas de toque, rolagem para o lado e as regras contra o visual "feito por IA". No resultado final, nenhuma falha nas regras fixas. Duas regras foram dispensadas com o motivo escrito no CSS.
- **Revisão independente:** um agente sem o histórico da conversa revisou a página e pediu oito correções, todas feitas.
- **Conferência de Henrique:** ele abriu o site no navegador e apontou o que precisava mudar:
  - as telas do app presas numa coluna estreita no computador;
  - o botão Entrar;
  - a captura cortada na aba do freguês.
- **Ainda pendente:** Lighthouse, navegação só com teclado, leitor de tela (NVDA) e o teste com o MockAPI real, que depende da URL da parte de Web.

## 5. Análise crítica

- **Benefícios:**
  - A IA acelerou o trabalho repetitivo, como os componentes, os testes e os ajustes de CSS em várias telas.
  - A Hallmark trocou o "gosto" por regras verificáveis: cada problema veio com o lugar e o motivo, e o `sloplint` confirmou a correção no navegador.
  - A revisão por um agente separado encontrou problemas que quem construiu a página já não enxergava.
- **Limitações:**
  - A IA escreveu a maior parte do código, então Henrique precisa estudar cada parte para explicar na apresentação.
  - Algumas decisões da IA pareciam boas no código e só se mostraram erradas na tela. Foi o caso das fotos de categoria e da coluna de celular no computador.
  - As ofertas foram testadas com uma imitação do MockAPI, não com o serviço real.
- **Dificuldades:**
  - A IA às vezes fez escolhas que contrariavam o documento de design, como o gelo em azul. Por isso, conferir cada mudança contra a fonte de verdade foi necessário.
  - Capturar as telas sem a barra de abas fixa e sem o indicador do modo dev pediu um script próprio.
  - A regra contra pontos no meio dos textos exigiu mudar também os testes que esperavam o texto antigo.
