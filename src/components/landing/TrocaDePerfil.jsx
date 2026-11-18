'use client';
import { useRef, useState, useSyncExternalStore } from 'react';
import EntrarComo from './EntrarComo';

// Os três perfis, cada um com a tela de verdade do site (capturada do app rodando).
// Sem JavaScript, os três painéis aparecem um embaixo do outro; com ele, viram abas (setas trocam a aba).
// No servidor (HTML estático) comScript é false; no navegador, depois de hidratar, vira true.
const nadaParaOuvir = () => () => {};
const PERFIS = [
  {
    id: 'feirante',
    aba: 'Feirante',
    titulo: 'Veja as caixas e anuncie',
    texto: 'Quando a caixa fica amarela, o anúncio já vem preenchido, com o prazo travado.',
    tela: '/telas/feirante.png',
    acao: 'Entrar como feirante',
    href: '/feirante',
  },
  {
    id: 'fregues',
    aba: 'Freguês',
    titulo: 'Reserve e retire na banca',
    texto: 'Xepa perto de você, com o selo de temperatura conferida e a hora de retirar.',
    tela: '/telas/xepa.png',
    acao: 'Ver a xepa de hoje',
    href: '/xepa',
  },
  {
    id: 'ong',
    aba: 'ONG',
    titulo: 'Combine a retirada da doação',
    texto: 'Peixe e queijo só aparecem para quem tem caixa térmica para levar.',
    tela: '/telas/ong.png',
    acao: 'Entrar como ONG',
    href: '/ong',
  },
];

export default function TrocaDePerfil() {
  const comScript = useSyncExternalStore(nadaParaOuvir, () => true, () => false);
  const [ativo, setAtivo] = useState(0);
  const abas = useRef([]);

  function teclado(evento) {
    const passo = evento.key === 'ArrowRight' ? 1 : evento.key === 'ArrowLeft' ? -1 : 0;
    if (!passo) return;
    const proximo = (ativo + passo + PERFIS.length) % PERFIS.length;
    setAtivo(proximo);
    abas.current[proximo]?.focus();
  }

  return (
    <div className="troca">
      {comScript && (
        <div role="tablist" aria-label="Perfis" className="troca-abas" onKeyDown={teclado}>
          {PERFIS.map((perfil, i) => (
            <button
              key={perfil.id}
              ref={(el) => (abas.current[i] = el)}
              type="button"
              role="tab"
              id={`aba-${perfil.id}`}
              aria-selected={i === ativo}
              aria-controls={`painel-${perfil.id}`}
              tabIndex={i === ativo ? 0 : -1}
              onClick={() => setAtivo(i)}
              className="troca-aba"
            >
              {perfil.aba}
            </button>
          ))}
        </div>
      )}
      {PERFIS.map((perfil, i) => (
        <section
          key={perfil.id}
          id={`painel-${perfil.id}`}
          role={comScript ? 'tabpanel' : undefined}
          aria-labelledby={comScript ? `aba-${perfil.id}` : undefined}
          hidden={comScript && i !== ativo}
          className="troca-painel"
        >
          <div className="troca-tela" data-slot={`tela-${perfil.id}`} data-kind="product" data-alt={`Tela do perfil ${perfil.aba} no celular`}>
            <img src={perfil.tela} alt={`Tela do site para ${perfil.aba.toLowerCase()}`} width="780" height="1688" loading="lazy" />
          </div>
          <div className="troca-texto">
            <h3>{perfil.titulo}</h3>
            <p>{perfil.texto}</p>
            <EntrarComo perfil={perfil.id} href={perfil.href}>
              {perfil.acao}
            </EntrarComo>
          </div>
        </section>
      ))}
    </div>
  );
}
