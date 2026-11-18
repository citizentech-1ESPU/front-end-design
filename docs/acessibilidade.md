# Revisão de acessibilidade · Xepa Certa

Revisão feita em 18/11/2026 no site publicado (https://xepa-certa-front.vercel.app), com dados reais do MockAPI da equipe.

## Lighthouse (celular, categoria Acessibilidade)

Lighthouse 12, modo celular, no Chrome. Meta do plano: 95 ou mais em todas as telas.

| Tela | Antes | Depois |
|---|---|---|
| `/` (landing) | 97 | 100 |
| `/feirante` (Suas caixas) | 96 | 100 |
| `/feirante/anunciar?caixa=caixa-3` | 100 | 100 |
| `/xepa` (Xepa perto de você) | 100 | 100 |
| `/xepa/oferta?id=...` (detalhe e reserva) | 100 | 100 |
| `/ong` (Doações para retirar) | 100 | 100 |

## Problema achado e correção

**Etiqueta "Complete o gelo" sem contraste no meio do piscar.** A etiqueta inteira piscava como o LED da caixa, descendo até 25% de opacidade. Nesse momento, o texto verde ficava com contraste de 1,5:1 (o mínimo AA é 4,5:1): por meio segundo, a cada segundo, quem está com a tela no sol não conseguia ler o estado. O Lighthouse apontou isso na landing e em `/feirante`.

Correção: agora só um ponto de LED, ao lado do texto, pisca. O texto fica sempre firme. O ponto é decorativo (`aria-hidden`), então o leitor de tela continua lendo só a palavra do estado. Arquivo: `src/components/caixa/StatusPill.jsx`, com teste em `caixa.test.jsx`.

## Tamanho e movimento

- **360 x 740 (celular):** nas 11 telas e na landing, a largura da página é exatamente 360 px, sem rolagem para o lado. Só a linha dos filtros por tipo rola para o lado, de propósito. Prints em [`docs/prints/`](prints/).
- **Movimento reduzido:** com `prefers-reduced-motion: reduce`, o ponto de LED para de piscar (`animation: none`) e o estado continua escrito. Conferido no Chrome com a emulação de mídia.

## O que já vinha certo

- Estado da caixa sempre escrito, nunca só pela cor; seta de temperatura decorativa, com a palavra "subindo", "descendo" ou "estável" para o leitor de tela.
- Um único `h1` por tela, no topo (`AppHeader`); na landing, link "Pular para o conteúdo".
- Campos com rótulo ligado (`FormField`), interruptores com `role="switch"`, filtros com `aria-pressed`.
- Diálogo de excluir e de cancelar abre no botão seguro, prende o Tab nos dois botões e fecha com Esc.
- Avisos ("Reserva feita!", "Retirada cancelada.") em região anunciada pelo leitor de tela; "Carregando…" escrito.
- Áreas de toque de 44 px ou mais e texto do corpo com 16 px ou mais.

## Ainda a conferir à mão

- Navegação só com teclado nos fluxos "anunciar a partir da caixa amarela" e "reservar".
- Leitor de tela (NVDA) em "Suas caixas" e no detalhe de uma oferta.
- Zoom do navegador em 200%.
