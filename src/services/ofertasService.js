import { requisitar } from './api';

const naoExiste = (falha) => falha?.status === 404;

// CRUD do recurso ofertas no MockAPI (design 6.5)
export async function listarOfertas() {
  try {
    return (await requisitar('/ofertas')) ?? [];
  } catch (falha) {
    if (naoExiste(falha)) return []; // o MockAPI responde 404 quando o recurso está vazio
    throw falha;
  }
}

export async function buscarOferta(id) {
  try {
    return await requisitar(`/ofertas/${id}`);
  } catch (falha) {
    if (naoExiste(falha)) return null;
    throw falha;
  }
}

export function criarOferta(dados) {
  return requisitar('/ofertas', { metodo: 'POST', corpo: dados });
}

export function atualizarOferta(id, dados) {
  return requisitar(`/ofertas/${id}`, { metodo: 'PUT', corpo: dados });
}

export async function excluirOferta(id) {
  await requisitar(`/ofertas/${id}`, { metodo: 'DELETE' });
}
