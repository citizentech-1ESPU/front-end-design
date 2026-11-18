'use client';
import { useCallback, useEffect, useState } from 'react';
import { CHAVES_LOCAIS } from '@/domain/constantes';
import { gravarLocal, lerLocal } from '@/services/armazenamentoLocal';

const PERFIS = ['feirante', 'fregues', 'ong'];
const perfilValido = (valor) => (PERFIS.includes(valor) ? valor : null);

// Perfil escolhido na tela inicial e se a ONG leva caixa térmica, guardados no navegador (sem login)
export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [temCaixaTermica, setTemCaixaTermica] = useState(false);

  // localStorage só existe no navegador: lido depois da montagem, nunca no build.
  // Ler aqui (e não no useState) evita diferença entre o HTML gerado no build e o navegador.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com o localStorage uma vez, na montagem
    setPerfil(perfilValido(lerLocal(CHAVES_LOCAIS.perfil, null)));
    setTemCaixaTermica(lerLocal(CHAVES_LOCAIS.caixaTermica, false) === true);
  }, []);

  const definirPerfil = useCallback((novo) => {
    const valor = perfilValido(novo);
    setPerfil(valor);
    gravarLocal(CHAVES_LOCAIS.perfil, valor);
  }, []);

  const definirCaixaTermica = useCallback((valor) => {
    const ligado = Boolean(valor);
    setTemCaixaTermica(ligado);
    gravarLocal(CHAVES_LOCAIS.caixaTermica, ligado);
  }, []);

  return { perfil, definirPerfil, temCaixaTermica, definirCaixaTermica };
}
