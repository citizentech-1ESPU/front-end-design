'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BANCA_DO_FEIRANTE } from '@/domain/constantes';
import { enriquecerOferta, semCamposCalculados } from '@/domain/enriquecerOferta';
import { podeDoar } from '@/domain/regras';
import { lerConfig } from '@/services/config';
import { recriarDemo } from '@/services/demoService';
import { atualizarOferta, criarOferta, excluirOferta, listarOfertas } from '@/services/ofertasService';
import { cancelarReserva, listarReservas } from '@/services/reservasService';

const pelaHora = (a, b) => new Date(a.venderAte) - new Date(b.venderAte);
const pelaDistancia = (a, b) => (a.distanciaM ?? 0) - (b.distanciaM ?? 0);

// Cada perfil vê um recorte diferente das ofertas (contrato dos hooks e RN7)
function aplicarFiltro(ofertas, filtro, { temCaixaTermica }) {
  if (filtro === 'feirante') {
    return ofertas.filter((o) => o.banca === BANCA_DO_FEIRANTE).sort(pelaHora);
  }
  if (filtro === 'ong') {
    return ofertas
      .filter((o) => o.ativa && o.aceitaDoacao && o.disponivel > 0)
      .sort(pelaHora)
      .map((o) => {
        const pode = podeDoar({ categoria: o.categoria, temCaixaTermica });
        return { ...o, podeDoar: pode, motivoDoacao: pode ? null : 'Precisa de caixa térmica.' };
      });
  }
  // freguês: ativas com disponível, da mais perto para a mais longe
  return ofertas.filter((o) => o.ativa && o.disponivel > 0).sort(pelaDistancia);
}

export function useOfertas(filtro, opcoes = {}) {
  const temCaixaTermica = Boolean(opcoes.temCaixaTermica);
  const { modoDemo } = lerConfig();
  const [ofertas, setOfertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const brutas = useRef([]); // ofertas como vieram do MockAPI, para o PUT do encerrar
  const montado = useRef(true);

  const carregar = useCallback(async () => {
    try {
      const [lista, reservas] = await Promise.all([listarOfertas(), listarReservas()]);
      if (!montado.current) return;
      brutas.current = lista;
      const contexto = { agora: new Date(), origem: window.location.origin };
      const completas = lista.map((oferta) => enriquecerOferta(oferta, reservas, contexto));
      setOfertas(aplicarFiltro(completas, filtro, { temCaixaTermica }));
      setErro(null);
    } catch (falha) {
      if (montado.current) setErro(falha.message);
    } finally {
      if (montado.current) setCarregando(false);
    }
  }, [filtro, temCaixaTermica]);

  useEffect(() => {
    montado.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- o estado só muda depois da resposta da API (após o await)
    carregar();
    return () => { montado.current = false; };
  }, [carregar]);

  // Funções que mudam dados nunca lançam erro: sempre resolvem com { ok, ... }
  const criar = useCallback(async (dados) => {
    try {
      const oferta = await criarOferta(dados);
      await carregar();
      return { ok: true, oferta };
    } catch (falha) {
      return { ok: false, erro: falha.message };
    }
  }, [carregar]);

  const atualizar = useCallback(async (id, dados) => {
    try {
      const oferta = await atualizarOferta(id, semCamposCalculados(dados));
      await carregar();
      return { ok: true, oferta };
    } catch (falha) {
      return { ok: false, erro: falha.message };
    }
  }, [carregar]);

  const encerrar = useCallback(async (id) => {
    try {
      const atual = brutas.current.find((o) => String(o.id) === String(id));
      if (!atual) return { ok: false, erro: 'Essa oferta não existe mais.' };
      await atualizarOferta(id, { ...semCamposCalculados(atual), status: 'encerrada' });
      await carregar();
      return { ok: true };
    } catch (falha) {
      return { ok: false, erro: falha.message };
    }
  }, [carregar]);

  // O MockAPI não apaga em cascata: as reservas da oferta saem antes
  const excluir = useCallback(async (id) => {
    try {
      const reservas = await listarReservas();
      const daOferta = reservas.filter((r) => String(r.ofertaId) === String(id));
      for (const reserva of daOferta) await cancelarReserva(reserva.id);
      await excluirOferta(id);
      await carregar();
      return { ok: true };
    } catch (falha) {
      return { ok: false, erro: falha.message };
    }
  }, [carregar]);

  // Botão "Criar ofertas de demonstração" (só no modo demonstração, com a lista vazia)
  const criarDemo = useCallback(async () => {
    if (!modoDemo) return { ok: false, erro: 'Só no modo demonstração.' };
    try {
      await recriarDemo();
      await carregar();
      return { ok: true };
    } catch (falha) {
      return { ok: false, erro: falha.message };
    }
  }, [modoDemo, carregar]);

  return { ofertas, carregando, erro, criar, atualizar, encerrar, excluir, recarregar: carregar, modoDemo, criarDemo };
}
