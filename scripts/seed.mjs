// npm run seed: apaga reservas e ofertas do MockAPI e recria as 6 ofertas de demonstração,
// com prazos contados a partir de agora. Lê a URL do .env.local (cp .env.example .env.local).
import { montarOfertasDemo } from '../src/data/ofertasDemo.mjs';

const base = (process.env.NEXT_PUBLIC_MOCKAPI_URL ?? '').replace(/\/+$/, '');
if (!base || base.includes('SEU-PROJETO')) {
  console.error('Crie o .env.local com cp .env.example .env.local');
  process.exit(1);
}

async function chamar(caminho, metodo = 'GET', corpo) {
  const resposta = await fetch(`${base}${caminho}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: AbortSignal.timeout(8000),
  });
  if (resposta.status === 404 && metodo === 'GET') return []; // recurso vazio
  if (!resposta.ok) throw new Error(`${metodo} ${caminho} respondeu ${resposta.status}`);
  return resposta.json();
}

try {
  for (const reserva of await chamar('/reservas')) await chamar(`/reservas/${reserva.id}`, 'DELETE');
  for (const oferta of await chamar('/ofertas')) await chamar(`/ofertas/${oferta.id}`, 'DELETE');
  const ofertas = montarOfertasDemo(new Date());
  for (const oferta of ofertas) await chamar('/ofertas', 'POST', oferta);
  console.log(`${ofertas.length} ofertas de demonstração criadas.`);
} catch (falha) {
  console.error(`Não deu para recriar as ofertas: ${falha.message}`);
  process.exit(1);
}
