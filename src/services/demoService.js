import { montarOfertasDemo } from '@/data/ofertasDemo.mjs';
import { criarOferta, excluirOferta, listarOfertas } from './ofertasService';
import { cancelarReserva, listarReservas } from './reservasService';

// Recria as ofertas de demonstração no MockAPI. Devolve quantas criou.
// apagarAntes: true limpa reservas e ofertas antes (é o que o npm run seed faz).
export async function recriarDemo({ apagarAntes = false, agora = new Date() } = {}) {
  if (apagarAntes) {
    for (const reserva of await listarReservas()) await cancelarReserva(reserva.id);
    for (const oferta of await listarOfertas()) await excluirOferta(oferta.id);
  }
  let criadas = 0;
  // uma por vez: o MockAPI grátis não gosta de muitas chamadas juntas
  for (const oferta of montarOfertasDemo(agora)) {
    await criarOferta(oferta);
    criadas += 1;
  }
  return criadas;
}
