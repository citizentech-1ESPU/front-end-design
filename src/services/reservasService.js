import { requisitar } from './api';

const naoExiste = (falha) => falha?.status === 404;

// CRUD do recurso reservas no MockAPI (design 6.5)
export async function listarReservas() {
  try {
    return (await requisitar('/reservas')) ?? [];
  } catch (falha) {
    if (naoExiste(falha)) return [];
    throw falha;
  }
}

export function criarReserva(dados) {
  return requisitar('/reservas', { metodo: 'POST', corpo: dados });
}

// Reserva que já sumiu (oferta excluída, por exemplo) conta como cancelada
export async function cancelarReserva(id) {
  try {
    await requisitar(`/reservas/${id}`, { metodo: 'DELETE' });
  } catch (falha) {
    if (!naoExiste(falha)) throw falha;
  }
}
