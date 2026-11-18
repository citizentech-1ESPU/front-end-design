'use client';
import { useEffect, useRef, useState } from 'react';
import { CAIXAS } from '@/data/caixas';
import { ATUALIZAR_CAIXAS_MS } from '@/domain/constantes';
import { montarCaixa } from '@/domain/montarCaixa';
import { leituraSimulada } from '@/domain/simulador';
import { lerConfig } from '@/services/config';
import { buscarUltimaLeitura } from '@/services/thingspeakService';

// As 4 caixas da Banca Mar Azul: a caixa-1 lida no ThingSpeak e as outras simuladas.
// Atualiza a cada 20 s; se o ThingSpeak falhar, só a caixa-1 fica "Sem leitura".
export function useCaixas() {
  const [caixas, setCaixas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  const inicio = useRef(null);

  useEffect(() => {
    let ativo = true; // evita mudar o estado depois que a tela fechou
    inicio.current = new Date();

    async function carregar() {
      const { canalId, modoDemo } = lerConfig();
      let leituraAoVivo = null;
      let falhou = false;
      try {
        leituraAoVivo = await buscarUltimaLeitura(canalId);
      } catch {
        falhou = true;
      }
      if (!ativo) return;
      const agora = new Date();
      setCaixas(CAIXAS.map((config) => {
        const leitura = config.fonte === 'sensor'
          ? leituraAoVivo
          : leituraSimulada(config.cenario, inicio.current, agora);
        return montarCaixa(config, leitura, { agora, modoDemo });
      }));
      setErro(falhou ? 'Não deu para ler a caixa ao vivo agora.' : null);
      setAtualizadoEm(agora);
      setCarregando(false);
    }

    carregar();
    const intervalo = setInterval(carregar, ATUALIZAR_CAIXAS_MS);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, []);

  return { caixas, carregando, erro, atualizadoEm };
}
