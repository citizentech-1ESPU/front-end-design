'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAVES_LOCAIS } from '@/domain/constantes';
import { enriquecerOferta } from '@/domain/enriquecerOferta';
import { opcoesDeRetirada } from '@/domain/horarios';
import { disponivel, estaAtiva } from '@/domain/regras';
import { validarReserva } from '@/domain/validacoes';
import { gravarLocal, lerLocal } from '@/services/armazenamentoLocal';
import { buscarOferta, listarOfertas } from '@/services/ofertasService';
import { cancelarReserva, criarReserva, listarReservas } from '@/services/reservasService';

// Sem login: o navegador guarda os ids das reservas feitas nele
const lerIds = () => {
  const ids = lerLocal(CHAVES_LOCAIS.reservas, []);
  return Array.isArray(ids) ? ids.map(String) : [];
};
const gravarIds = (ids) => gravarLocal(CHAVES_LOCAIS.reservas, ids);

// tipo: 'compra' (freguês) ou 'doacao' (ONG)
export function useReservas(tipo) {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const montado = useRef(true);

  const carregar = useCallback(async ({ limparIds = false } = {}) => {
    try {
      const [todas, ofertas] = await Promise.all([listarReservas(), listarOfertas()]);
      if (!montado.current) return;
      const ids = lerIds();
      const existentes = new Set(todas.map((r) => String(r.id)));
      // Ao abrir a tela, tira do navegador os ids que sumiram do MockAPI (oferta excluída, por exemplo)
      const limpos = limparIds ? ids.filter((id) => existentes.has(id)) : ids;
      if (limpos.length !== ids.length) gravarIds(limpos);

      const contexto = { agora: new Date(), origem: window.location.origin };
      setReservas(todas
        .filter((r) => limpos.includes(String(r.id)) && r.tipo === tipo)
        .map((reserva) => {
          const oferta = ofertas.find((o) => String(o.id) === String(reserva.ofertaId));
          return { ...reserva, oferta: oferta ? enriquecerOferta(oferta, todas, contexto) : null };
        }));
      setErro(null);
    } catch (falha) {
      if (montado.current) setErro(falha.message);
    } finally {
      if (montado.current) setCarregando(false);
    }
  }, [tipo]);

  useEffect(() => {
    montado.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- o estado só muda depois da resposta da API (após o await)
    carregar({ limparIds: true });
    return () => { montado.current = false; };
  }, [carregar]);

  // Relê a oferta e as reservas na hora, para diminuir a chance de duas pessoas levarem a última unidade
  const reservar = useCallback(async (dados) => {
    try {
      const [oferta, todas] = await Promise.all([buscarOferta(dados.ofertaId), listarReservas()]);
      const agora = new Date();
      if (!oferta || !estaAtiva(oferta, agora)) {
        return { ok: false, erros: { geral: 'Essa oferta não está mais disponível.' } };
      }
      const erros = validarReserva({ ...dados, tipo }, {
        disponivel: disponivel(oferta, todas),
        categoria: oferta.categoria,
        unidade: oferta.unidade,
        venderAte: oferta.venderAte,
        agora,
      });
      if (Object.keys(erros).length > 0) return { ok: false, erros };

      const reserva = await criarReserva({
        ofertaId: String(oferta.id),
        tipo,
        quantidade: Number(dados.quantidade),
        apelido: String(dados.apelido).trim(),
        retirarAte: tipo === 'doacao' ? dados.retirarAte : oferta.venderAte,
        temCaixaTermica: tipo === 'doacao' ? Boolean(dados.temCaixaTermica) : null,
        criadaEm: agora.toISOString(),
      });
      gravarIds([...lerIds(), String(reserva.id)]);
      await carregar();
      return { ok: true, reserva };
    } catch (falha) {
      return { ok: false, erros: { geral: falha.message } };
    }
  }, [tipo, carregar]);

  const cancelar = useCallback(async (id) => {
    try {
      await cancelarReserva(id);
      gravarIds(lerIds().filter((guardado) => guardado !== String(id)));
      await carregar();
      return { ok: true };
    } catch (falha) {
      return { ok: false, erro: falha.message };
    }
  }, [carregar]);

  const opcoesRetirada = useCallback((oferta) => (oferta ? opcoesDeRetirada(oferta.venderAte, new Date()) : []), []);

  return { reservas, carregando, erro, reservar, cancelar, opcoesRetirada };
}
