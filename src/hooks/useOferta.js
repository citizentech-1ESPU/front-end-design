'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { enriquecerOferta } from '@/domain/enriquecerOferta';
import { buscarOferta } from '@/services/ofertasService';
import { listarReservas } from '@/services/reservasService';

// Uma oferta pelo id (página /xepa/oferta?id=...). Oferta excluída vem null, sem quebrar a tela.
export function useOferta(id) {
  const [oferta, setOferta] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const montado = useRef(true);

  const carregar = useCallback(async () => {
    try {
      // sem id na página, nem chama a internet
      const [encontrada, todas] = id ? await Promise.all([buscarOferta(id), listarReservas()]) : [null, []];
      if (!montado.current) return;
      const daOferta = todas.filter((r) => String(r.ofertaId) === String(id));
      setReservas(daOferta);
      setOferta(encontrada
        ? enriquecerOferta(encontrada, daOferta, { agora: new Date(), origem: window.location.origin })
        : null);
      setErro(null);
    } catch (falha) {
      if (montado.current) setErro(falha.message);
    } finally {
      if (montado.current) setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    montado.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- o estado só muda depois da resposta da API (após o await)
    carregar();
    return () => { montado.current = false; };
  }, [carregar]);

  return { oferta, reservas, disponivel: oferta ? oferta.disponivel : 0, carregando, erro, recarregar: carregar };
}
