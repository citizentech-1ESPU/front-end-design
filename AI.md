# Uso de IA no site da Xepa Certa (Front-end Design)

**Disciplina:** Front-end Design · **Responsável:** Henrique Lira (RM571009) · **Time:** SafeTech · GS CitizenTech 2026.2, FIAP

Registro do uso de Inteligência Artificial no desenvolvimento do site, organizado nas cinco partes pedidas pela FIAP (PDF, pág. 41). Henrique Lira conduziu o trabalho: definiu os objetivos, as restrições e o material de referência, solicitou cada etapa e aprovou os resultados. As ferramentas de IA atuaram como apoio técnico no planejamento, na implementação e na revisão. Onde o registro informa que a IA escreveu código ou testes, essa autoria fica explícita.

A camada de regras, serviços e hooks (`src/domain`, `src/services`, `src/hooks`, `src/data`) pertence à parte de Web Development, de Daniel Gomes Torres (RM573436). Ela veio do repositório `web_development`, com o autor indicado em cada commit, e não é descrita aqui como trabalho do Front-end.

O texto completo de cada pedido, sessão por sessão, está em [`prompts.md`](prompts.md).

------------------------------------------------

## 1. Ferramentas utilizadas

- **Claude Code** (assistente de programação da Anthropic, usado no terminal, dentro da pasta do projeto): principal ferramenta de implementação. Leu os PDFs da entrega e o documento de design, montou o repositório, escreveu componentes, telas, landing e testes, executou testes, lint e build e registrou os commits.
- **Hallmark** (skill de design de código aberto, da Together AI, instalada no Claude Code): conjunto de regras de design verificáveis (cores e fontes em tokens, ícones no lugar de emojis, foco visível, contraste) e de scripts que:
  - definem a estrutura da página;
  - buscam fotos com licença aberta;
  - capturam as telas reais do site;
  - verificam a página no navegador, em larguras de 375 a 1920 px (`sloplint`).
- **Agente de revisão** (Claude Code, em contexto separado): nova instância, sem o histórico da construção, usada para revisar a página pronta de forma independente.
- **Claude in Chrome** (extensão do Claude para o navegador): usada para percorrer o CRUD no site publicado, com o MockAPI real da equipe.
- **Forma de trabalho:** Henrique definiu o problema, as restrições (manter as cores dos estados da caixa, o tom de voz e as onze telas) e o material (a logo do time e fotos de feira com licença aberta). A IA propôs o plano, implementou e verificou cada etapa, sempre com uma única tarefa por pedido.

## 2. Interações realizadas

Decisões de Henrique, por data:

- **11/11:** construir a primeira versão do Front a partir do plano de Front-end (`03-front-lira.pdf`) e do histórico do repositório de Web, com varredura completa dos PDFs antes da implementação.
- **17/11:** manter o site do Front num repositório próprio da organização (`front-end-design`), com deploy próprio, e copiar para ele a camada de regras, serviços e hooks da parte de Web, depois de confirmar nos PDFs que as duas entregas são ligadas.
- **17/11:** refazer o Front com a Hallmark, preservando as cores dos estados da caixa (as mesmas do LED, do painel e do site), o tom de voz de feira, as onze telas e a ligação com os hooks.
- **17/11:** o site deve apresentar a solução, como uma landing, e não abrir apenas nas telas de uso. Usar a logo nova do time e fotos de feira com licença aberta.
- **18/11:** corrigir todos os pontos da revisão independente e abrir as telas do app na largura do computador.
- **18/11:** publicar o site com o MockAPI da equipe e conferir o CRUD no site publicado, sem apagar dados da equipe.
- **19/11:** padronizar este registro e o `prompts.md` no mesmo formato do registro de Python da equipe, separados por etapas de desenvolvimento.

Todos os pedidos seguiram a mesma estrutura:
- **Contexto:** onde está o material.
- **Fonte de verdade:** o documento de design, os PDFs e a logo.
- **Tarefa:** uma única tarefa por pedido.
- **Restrições:** o que não pode mudar.
- **Critério de pronto:** testes, lint, build e `sloplint` sem falha.

Exemplos representativos de pedidos e respostas:

- **Confirmar a ligação entre Front e Web antes de copiar código**
  - Pedido: "Antes de copiar qualquer código de Web para o repositório novo, confirme nos PDFs da GS e nos planos da equipe se as entregas de Front e de Web são ligadas, citando a página."
  - Resposta: a IA mostrou que o PDF define a parte de Web como "o JavaScript que dá vida à interface, no mesmo repositório do Front-end" (pág. 57) e que o Front exige hooks personalizados e CRUD numa API externa (págs. 41 e 42). Com isso, a camada de Web foi copiada com crédito ao autor.
- **Preservar a marca no redesenho**
  - Pedido: "Leia as cores e as fontes do documento de design (seção 6.3) e da logo nova e passe tudo para tokens. Os estados da caixa (verde, amarelo, vermelho, azul do gelo) são sinais, não cor de destaque, e não mudam."
  - Resposta: tokens em OKLCH com a paleta da logo, as fontes Archivo e Atkinson Hyperlegible e os estados da caixa preservados. Na conferência com o documento de design, o estado "gelo", que havia ficado azul, voltou para o verde do LED.
- **Landing que apresenta a solução**
  - Pedido: "Crie a landing em `/`. No hero, o produto: as quatro caixas lidas pelo `useCaixas`. Depois, a feira de hoje em comparação com a feira com a Xepa Certa, as telas reais de cada perfil, a fala do feirante liberada no documento de design, a regra das 2 e 4 horas e as três entradas. Nenhum número, depoimento ou logo inventado."
  - Resposta: landing com as caixas ao vivo (a caixa 1 lida do ThingSpeak), a comparação de antes e depois, abas por perfil com capturas reais do app, a citação do feirante, a tabela da regra e os botões de entrada.
- **Revisão independente**
  - Pedido: "Leia as instruções de revisão final da Hallmark e siga-as. Você não acompanhou a construção da página. Responda com o veredito e as correções, da mais cara para a mais barata, com arquivo e linha."
  - Resposta: veredito "fix", com oito pontos, entre eles a seção dos perfis fraca, a foto de pimentas inadequada para uma solução voltada a peixe, a logo repetida dentro das capturas e os botões do fecho com larguras diferentes. Todos foram corrigidos.
- **Responsividade**
  - Pedido: "No computador, as telas do app não podem ficar presas numa coluna de celular: use a largura da tela, organize as listas em grade e mantenha o celular como está."
  - Resposta: telas até 72rem, listas em 2 ou 3 colunas, detalhe da oferta em duas colunas e abas no alto, no computador.
- **Publicação, CRUD real e acessibilidade**
  - Pedido: "Publique o site com a URL do MockAPI da equipe e confira, no site publicado, cada operação do CRUD diretamente na API. Depois execute o Lighthouse (celular, Acessibilidade) nas seis telas do plano, com meta de 95 ou mais. Não apague dados da equipe."
  - Resposta: site publicado na Vercel; criar, consultar, atualizar e excluir conferidos no site e na API, com a reserva de teste cancelada e a quantidade editada devolvida ao valor original. O Lighthouse ficou entre 96 e 100; a IA identificou a causa na etiqueta "Complete o gelo", que piscava inteira, e após a correção as seis telas ficaram com 100.

## 3. Aplicação no projeto

- **Desenvolvido com auxílio da IA, a partir das decisões de Henrique:**
  - **Landing (`/`):** `src/app/page.jsx`, `src/app/landing.css` e os componentes de `src/components/landing/`, com:
    - as quatro caixas ao vivo no hero;
    - a comparação entre a feira de hoje e a feira com a Xepa Certa;
    - a troca de perfil com as telas reais;
    - a fala do feirante entrevistado;
    - a tabela da regra das 2 e 4 horas;
    - as três entradas, sem cadastro.
  - **Sistema visual da marca:** `src/app/tokens.css`, `base.css` e `globals.css`.
  - **27 componentes** em `src/components/`, entre eles o cartão da caixa com a plaquinha amarela de "Hora da xepa", o cartão de oferta, o cabeçalho com a logo, as abas por perfil, os formulários, os estados de vazio, carregando e erro, o diálogo de confirmação e o aviso.
  - **As onze telas do app** em `src/app/(app)/`, em coluna de celular no telefone e em grade no computador.
  - **Testes** da landing, dos componentes e das telas.
  - **Documentação:** o `README.md`, este arquivo, o `prompts.md`, a revisão de acessibilidade (`docs/acessibilidade.md`) e os prints de 360 px (`docs/prints/`).
- **Sugestões da IA incorporadas ao projeto:**
  - mostrar no hero o produto funcionando (as caixas lidas do ThingSpeak), em vez de uma ilustração;
  - usar a plaquinha amarela da logo como selo de "Hora da xepa";
  - ilustrar a landing com capturas das telas reais do site;
  - citar a única fala literal liberada da entrevista com o feirante (documento de design, seção 2);
  - trocar o ponto no meio dos textos ("Banca Mar Azul · 350 m") por vírgula ("Banca Mar Azul, a 350 m").
- **Modificado depois da conferência:**
  - as fotos por categoria saíram das telas do app, porque mostravam um produto diferente do anunciado;
  - o estado "Complete o gelo" voltou para o verde, que é a cor do LED no documento de design;
  - a foto da landing passou de pimentas para peixe no gelo;
  - as capturas foram recortadas abaixo do cabeçalho do app;
  - as telas do app ganharam a largura do computador;
  - a etiqueta "Complete o gelo" deixou de piscar inteira: agora só o ponto de LED pisca e o texto fica firme.

## 4. Validação das respostas

- **Testes automatizados:** 230 testes passando (Vitest e Testing Library), incluindo os 7 testes da landing e os 3 do piscar da etiqueta. Cobrem o único `h1` por tela, as ações do hero, as quatro caixas, os estados de carregando e erro, a tabela da regra, a gravação do perfil e as abas com as setas do teclado.
- **Lint e build:** `npm run lint` sem erro e `npm run build` gerando a landing e as onze rotas estáticas.
- **No navegador:**
  - o site foi executado com uma cópia local do MockAPI, fora do repositório, e com as seis ofertas de demonstração;
  - a caixa 1 leu o ThingSpeak real (canal 3571880);
  - as capturas das telas foram feitas a partir do build de produção;
  - no site publicado, com o MockAPI real da equipe, as operações de criar, reservar, editar e cancelar foram conferidas diretamente na API.
- **Lighthouse (celular, Acessibilidade):** 100 nas seis telas do plano, depois da correção do piscar (antes, 97 na landing e 96 em "Suas caixas"). Detalhes em [`docs/acessibilidade.md`](docs/acessibilidade.md).
- **Celular:** prints de 360 x 740 das onze telas, com a largura da página medida em cada uma, sem rolagem para o lado. Com movimento reduzido, o ponto de LED para de piscar.
- **Verificação de design (`sloplint` da Hallmark):** landing e telas abertas no navegador em 375, 1024, 1280, 1440 e 1920 px, medindo contraste, foco, áreas de toque e rolagem para o lado. Resultado final sem falhas nas regras fixas. Duas regras foram dispensadas com o motivo registrado no CSS: a altura do cartão de oferta, que é um botão grande de propósito, e o estado desativado do cartão da caixa.
- **Revisão independente:** um agente sem o histórico da conversa revisou a página e apontou oito correções, todas aplicadas.
- **Conferência de Henrique no navegador:** apontou as telas do app presas numa coluna estreita no computador, o formato do botão Entrar e a captura cortada na aba do freguês; os três pontos foram corrigidos.
- **Erros encontrados e ajustes:**

| Problema | Como apareceu | O que foi feito |
|---|---|---|
| Foto de laranja na oferta de banana | capturas das telas | fotos por categoria retiradas das telas do app |
| "Complete o gelo" em azul | leitura do documento de design | volta ao verde do LED |
| Indicador do modo de desenvolvimento nas capturas | capturas das telas | capturas refeitas a partir do build de produção |
| Imagens da landing sem carregar | `sloplint` no navegador | capturas incluídas antes do build; build refeito |
| Texto encostado na borda a 375 px | `sloplint` no navegador | aspas penduradas da citação desligadas no celular |
| Caixa dentro de caixa no diálogo de exclusão | `sloplint` | botões do diálogo sem borda |
| Testes esperando "Banca Mar Azul · 350 m" | `npm test` | texto e testes atualizados para "Banca Mar Azul, a 350 m" |
| `setState` dentro de `useEffect` | `npm run lint` | substituição por `useSyncExternalStore` |
| "Complete o gelo" ilegível no meio do piscar (contraste 1,5:1) | Lighthouse no site publicado | apenas o ponto de LED pisca; o texto fica firme |
| Print de 360 px cortado | Chrome sem interface no Windows | prints refeitos com a emulação de celular do Chrome |

## 5. Análise crítica

- **Benefícios:**
  - A IA agilizou o trabalho repetitivo, como os componentes, os testes e os ajustes de CSS em várias telas.
  - A Hallmark trouxe regras de design verificáveis: cada problema apareceu com local e motivo, e o `sloplint` confirmou a correção no navegador.
  - A revisão por um agente separado encontrou problemas que não apareciam para quem acompanhou a construção.
  - Dividir o trabalho em etapas curtas, com critério de pronto definido, prendeu cada erro à etapa em que surgiu.
- **Limitações:**
  - O código e os testes foram escritos pela IA; por isso, o estudo de cada parte por Henrique é parte da preparação para a apresentação.
  - Algumas escolhas pareciam corretas no código e só se mostraram inadequadas na tela, como as fotos por categoria e a coluna de celular no computador.
  - Uma única ferramenta automática não basta: o `sloplint` mede contraste e não apontou o problema do piscar, que o Lighthouse identificou.
  - Ficam como próximas conferências manuais: navegação somente com teclado, leitor de tela (NVDA), zoom de 200% e uso em celular físico.
- **Dificuldades:**
  - Em alguns pontos a IA contrariou o documento de design, como no estado de gelo em azul; por isso, cada mudança foi conferida contra a fonte de verdade.
  - Capturar as telas sem a barra de abas fixa e sem o indicador do modo de desenvolvimento exigiu um script próprio.
  - A padronização dos textos sem ponto no meio exigiu atualizar também os testes que esperavam o texto anterior.

---

## Registro das sessões

Resumo das sessões por etapa de desenvolvimento. O pedido completo de cada sessão, o que a IA fez e como o resultado foi conferido estão em [`prompts.md`](prompts.md).

### Etapa 1 · Planejamento e base do repositório
- **11/11 · Primeira versão do Front:** implementação do plano de Front-end, com 24 componentes e onze telas; serviu de inventário para o redesenho.
- **17/11 · Planejamento do repositório:** criação do `front-end-design` e confirmação, nos PDFs, da ligação entre Front e Web.
- **17/11 · Tarefa 1:** cópia da camada de Web em cinco commits, com o autor e a origem; 144 testes da parte de Web passando.

### Etapa 2 · Identidade visual e componentes
- **17/11 · Tarefa 2:** sistema visual da marca em tokens, com Archivo e Atkinson Hyperlegible.
- **17/11 · Tarefa 3:** componentes no sistema novo, com logo no cabeçalho e plaquinha de "Hora da xepa"; 49 testes de componentes passando.

### Etapa 3 · Telas do app
- **17/11 · Tarefa 4:** onze telas em coluna de celular, com o mesmo cabeçalho e a mesma barra de abas.

### Etapa 4 · Landing, logo e imagens
- **17/11 · Tarefa 5:** logo, fotos com licença aberta e capturas das telas reais.
- **17/11 · Tarefa 6:** landing que apresenta a solução, com 7 testes.

### Etapa 5 · Verificação, revisão independente e responsividade
- **17/11 · Tarefa 7:** `sloplint` sem falha; 227 testes passando.
- **18/11 · Revisão final em contexto separado:** oito correções apontadas e aplicadas.
- **18/11 · Responsividade:** telas do app na largura do computador e nenhuma rolagem para o lado de 360 a 1440 px.

### Etapa 6 · Publicação, CRUD real e acessibilidade
- **18/11 · Publicação:** site na Vercel, CRUD conferido na API real e Lighthouse 100 nas seis telas; 230 testes passando.

### Etapa 7 · Documentação da entrega
- **17/11 · Tarefa 8:** README e primeira versão do registro de uso de IA.
- **19/11 · Padronização:** este arquivo e o `prompts.md` no formato do registro de Python da equipe, por etapas.
