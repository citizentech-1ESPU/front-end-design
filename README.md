<p><img src="public/logo/xepa-certa-logo.svg" alt="Xepa Certa" width="220"></p>

# Xepa Certa · site (Front-end Design)

Site da Xepa Certa, do time SafeTech, para a Global Solution 2026.2 da FIAP (CitizenTech). Uma landing apresenta a solução, e onze telas atendem quem usa: o feirante, o freguês e as ONGs.

## Ficha da CitizenTech

| Campo | Conteúdo |
|---|---|
| Nome | Xepa Certa |
| Cidade e bairro | São Paulo, Zona Norte (feira de domingo da Av. Engenheiro Caetano Álvares) |
| Cidadão beneficiado | Feirante que vende perecível (peixe, queijo, frios). Também os fregueses do bairro e as ONGs e cozinhas solidárias que recebem doações. |
| Problema | O feirante não tem como saber se o peixe e o queijo ficaram frios o suficiente: perde mercadoria quando o gelo acaba antes do esperado, e a sobra que ainda está boa não chega a quem precisa a tempo. |
| Como funciona | Um sensor na caixa térmica mede a temperatura, soma o tempo que o produto passou acima de 5 °C e acende verde, amarelo ou vermelho, mesmo sem internet. No amarelo, o feirante anuncia a xepa no site, e fregueses e ONGs perto da feira reservam e retiram antes de estragar. O vermelho bloqueia venda e doação. |
| O que cada parte faz | Edge: a caixa que mede e decide sozinha. Front-end e Web: este site. Python: o painel da banca. Matemática: o modelo de quanto tempo a caixa aguenta. STED: requisitos, jornada e protótipo. Pitch: a história em 3 minutos. |
| Indicador de impacto | Quilos de perecível que deixaram de ir para o lixo por feira (vendidos na xepa mais doados) e reais de perda evitada por feirante. |
| ODS | ODS 2 (meta 2.1), ODS 3 (metas 3.3 e 3.d) e ODS 11 (meta 11.6). |

## O que o site faz

- **Landing (`/`):** apresenta a solução. As quatro caixas da banca aparecem ao vivo (a caixa 1 é lida do ThingSpeak, as outras três são simuladas). Também mostra a diferença entre a feira de hoje e a feira com a Xepa Certa, as telas reais de cada perfil, a fala do feirante entrevistado e a regra das 2 e 4 horas. Cada perfil entra por um botão, sem cadastro.
- **Feirante:** vê as caixas, anuncia a xepa a partir da caixa amarela (o formulário vem preenchido e o prazo fica travado), edita, encerra e exclui as ofertas, e manda a oferta no WhatsApp.
- **Freguês:** vê a xepa perto da feira, filtra por tipo, reserva com um apelido e acompanha as reservas.
- **ONG:** diz se tem caixa térmica (peixe e queijo só aparecem para quem tem), combina a retirada das doações e acompanha as retiradas.

### Telas

| Rota | Perfil | O que faz |
|---|---|---|
| `/` | todos | landing: apresenta a solução e leva cada perfil para a sua parte |
| `/sobre` | todos | ficha da CitizenTech, como funciona, ODS e equipe |
| `/feirante` | feirante | Suas caixas: estado, temperatura, tempo fora do frio, aviso de gelo |
| `/feirante/anunciar?caixa=` | feirante | Anunciar na xepa a partir de uma caixa |
| `/feirante/ofertas` | feirante | Suas ofertas: WhatsApp, encerrar e excluir |
| `/feirante/ofertas/editar?id=` | feirante | Editar oferta |
| `/xepa` | freguês | Xepa perto de você, com filtro por tipo |
| `/xepa/oferta?id=` | freguês | detalhe da oferta e reserva |
| `/xepa/reservas` | freguês | Minhas reservas |
| `/ong` | ONG | doações para retirar e retirada combinada |
| `/ong/retiradas` | ONG | Minhas retiradas |

## Requisitos da disciplina (Front-end Design)

| Requisito | Onde está |
|---|---|
| React com Next.js | Next.js 16 (App Router), exportado como páginas estáticas |
| Tailwind CSS | Tailwind 4, com os tokens da marca em `src/app/tokens.css` (`bg-paper`, `text-accent`...) |
| 8 componentes ou mais | 27 componentes em `src/components/` (`ui/`, `caixa/`, `oferta/`, `layout/`, `formularios/`, `landing/`) |
| `useState` e `useEffect` | `useState` nas telas, nos filtros, nas abas da landing e nos formulários; `useEffect` no `ConfirmDialog` (foco e tecla Esc, com limpeza) e no `Toast` (tempo para sumir, com `clearTimeout`) |
| 2 hooks personalizados ou mais | 6 hooks em `src/hooks/`: `usePerfil`, `useCaixas`, `useOfertas`, `useOferta`, `useReservas`, `useOfertaForm` |
| Lógica separada da tela | regras em `src/domain/`, acesso aos dados em `src/services/`, estado em `src/hooks/`; as telas só chamam os hooks |
| API externa com CRUD | MockAPI (criar, listar, editar e excluir ofertas e reservas) e ThingSpeak (leituras da caixa) |
| Funcionalidade real, não só interface | anunciar, reservar, combinar retirada, cancelar, encerrar e excluir funcionam de ponta a ponta |
| Uso de IA documentado | [`prompts.md`](prompts.md) |

A camada de regras, serviços e hooks (`src/domain`, `src/services`, `src/hooks`, `src/data`, `scripts/seed.mjs`) é da parte de Web Development (Daniel Gomes Torres). Ela veio do repositório [`web_development`](https://github.com/citizentech-1ESPU/web_development), commit `da0a395`, porque o PDF da GS define a parte de Web como "o JavaScript que dá vida à interface, no mesmo repositório do Front-end".

## Identidade visual

- **Logo:** a plaquinha amarela da feira pendurada no prego (`public/logo/`). O selo "Hora da xepa" nas telas usa a mesma placa inclinada.
- **Cores:** as do documento de design (seção 6.3), em OKLCH, em `src/app/tokens.css`. O azul `#1D4E89` é a marca. Verde, amarelo e vermelho são os estados da caixa, os mesmos do LED, do painel em Python e do site.
- **Fontes:** Archivo nos títulos (a mesma família desenhada na logo) e Atkinson Hyperlegible no texto, feita para leitura fácil.
- **Fotos:** só fotos com licença aberta (Wikimedia Commons), com crédito na página. As telas do app não usam foto de produto, para não mostrar um peixe que não é o da oferta.

## Acessibilidade

- Contraste AA em todos os pares de cor; foco visível em todo elemento que recebe clique.
- Áreas de toque de 44 px ou mais; texto do corpo com 16 px ou mais.
- O estado da caixa aparece sempre escrito, nunca só pela cor.
- Animações (o piscar do LED, a plaquinha inclinada) param com `prefers-reduced-motion`.
- A landing funciona sem JavaScript: as abas de perfil viram três blocos, um embaixo do outro.
- Um link "Pular para o conteúdo" aparece no foco do teclado.
- Checagem automática com o `sloplint` da Hallmark, no navegador e em larguras de 375 a 1920 px: nenhuma falha nas regras fixas.
- Ainda falta conferir à mão: Lighthouse, navegação só com teclado, leitor de tela (NVDA) e zoom de 200%.

## Tecnologias

- Next.js 16.4, React 19.3 e Tailwind CSS 4.3.
- Vitest 5, Testing Library e jsdom: 227 testes (regras, serviços, hooks, componentes, telas e landing).
- MockAPI (ofertas e reservas) e ThingSpeak (leituras da caixa, canal 3571880).

## Pré-requisitos

- Node.js 22.13 ou mais novo.
- Um projeto no MockAPI com os recursos `ofertas` e `reservas` (a URL fica com a parte de Web).

## Instalação

```bash
git clone https://github.com/citizentech-1ESPU/front-end-design.git
cd front-end-design
npm ci
cp .env.example .env.local   # preencha a URL do MockAPI e o canal do ThingSpeak
```

## Execução

```bash
npm run dev     # site em http://localhost:3000
npm test        # testes (Vitest)
npm run lint    # ESLint
npm run build   # gera o site estático em out/
npm run seed    # cria as ofertas de demonstração no MockAPI
```

## Estrutura de pastas

```
src/
├── app/
│   ├── page.jsx, landing.css   landing
│   ├── (app)/                  as telas do feirante, do freguês e da ONG, e a página Sobre
│   ├── tokens.css, base.css    tokens da marca e regras de base
│   └── globals.css             Tailwind e estilos das telas do app
├── components/                 27 componentes (só recebem props; a landing usa dois hooks)
├── hooks/                      os 6 hooks (parte de Web)
├── services/                   MockAPI, ThingSpeak e armazenamento local (parte de Web)
├── domain/                     regras da caixa, prazos e preços (parte de Web)
└── data/                       caixas simuladas e ofertas de demonstração (parte de Web)
public/
├── logo/                       a logo nas versões normal, branca e compacta
├── telas/                      capturas das telas reais, usadas na landing
└── fotos/                      foto de peixe no gelo (Wikimedia Commons, CC BY-SA 3.0)
```

## Créditos

Foto da landing: [MichaelMaggs](https://commons.wikimedia.org/wiki/File:Oweston_sting_fish_for_sale_at_Tsukiji_Fishmarket,_Tokyo-30.jpg), CC BY-SA 3.0, Wikimedia Commons.

## Equipe · time SafeTech

| Nome | RM | Parte |
|---|---|---|
| Pedro Passos Corsini | RM573493 | Python, Matemática e Pitch |
| Daniel Gomes Torres | RM573436 | Web Development |
| Henrique Lira | RM571009 | Front-end Design |
| Pedro Thyago de Araújo Santos | RM570939 | Edge Computing e STED |
