'use client';
import { useCallback, useState } from 'react';
import { CAIXAS } from '@/data/caixas';
import {
  BANCA_DO_FEIRANTE, CATEGORIAS, CATEGORIAS_COM_FRIO, DISTANCIA_DEMO_M, FEIRA,
} from '@/domain/constantes';
import { semCamposCalculados } from '@/domain/enriquecerOferta';
import { opcoesDePrazo } from '@/domain/horarios';
import { precoSugerido as calcularPrecoSugerido, lerNumero } from '@/domain/precos';
import { prazoPadraoSemCaixa } from '@/domain/regras';
import { validarOferta } from '@/domain/validacoes';
import { lerConfig } from '@/services/config';
import { atualizarOferta, criarOferta } from '@/services/ofertasService';

const CATEGORIAS_LIVRES = CATEGORIAS.filter((c) => !CATEGORIAS_COM_FRIO.includes(c.valor));
const emojiDe = (categoria) => CATEGORIAS.find((c) => c.valor === categoria)?.emoji ?? '🛒';

function definirModo(caixa, oferta) {
  if (oferta) return 'editar';
  if (caixa) return 'caixa';
  return 'livre';
}

// Valores que já vêm no formulário: da caixa (data/caixas.js), da oferta em edição ou em branco
function valoresIniciais({ caixa, oferta, agora, modoDemo }) {
  if (oferta) {
    return {
      produto: oferta.produto, categoria: oferta.categoria, emoji: oferta.emoji, unidade: oferta.unidade,
      quantidade: oferta.quantidade, precoNormal: oferta.precoNormal, precoXepa: oferta.precoXepa,
      venderAte: new Date(oferta.venderAte).toISOString(), aceitaDoacao: Boolean(oferta.aceitaDoacao),
    };
  }
  if (caixa) {
    const config = CAIXAS.find((c) => c.id === caixa.id) ?? {};
    const precoNormal = config.precoNormalSugerido ?? '';
    return {
      produto: config.produtoSugerido ?? caixa.nome, categoria: caixa.categoria, emoji: caixa.emoji,
      unidade: config.unidade ?? 'kg', quantidade: '', precoNormal,
      precoXepa: calcularPrecoSugerido(Number(precoNormal)) ?? '',
      venderAte: caixa.prazoMaximo ?? '', aceitaDoacao: true,
    };
  }
  return {
    produto: '', categoria: 'fruta', emoji: emojiDe('fruta'), unidade: 'kg', quantidade: '',
    precoNormal: '', precoXepa: '', venderAte: prazoPadraoSemCaixa({ agora, modoDemo }).toISOString(), aceitaDoacao: true,
  };
}

// Formulário de anunciar e de editar oferta. Modos: 'caixa' (prazo vindo da caixa), 'livre' (fruta,
// verdura ou outro, sem caixa) e 'editar' (o prazo só pode diminuir).
export function useOfertaForm({ caixa = null, oferta = null } = {}) {
  const { modoDemo } = lerConfig();
  const modo = definirModo(caixa, oferta);
  const [agora] = useState(() => new Date());
  const [valores, setValores] = useState(() => valoresIniciais({ caixa, oferta, agora, modoDemo }));
  const [tocados, setTocados] = useState([]); // campos que a pessoa já mexeu
  const [preenchidoPara, setPreenchidoPara] = useState(caixa?.id ?? null);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  // A caixa chegou depois (a tela ainda carregava): preenche uma vez, sem apagar o que já foi digitado.
  // É o jeito do React de ajustar o estado quando uma prop muda, sem useEffect.
  if (caixa && !oferta && preenchidoPara !== caixa.id) {
    setPreenchidoPara(caixa.id);
    const daCaixa = valoresIniciais({ caixa, oferta: null, agora, modoDemo });
    setValores((atuais) => ({ ...daCaixa, ...Object.fromEntries(tocados.map((campo) => [campo, atuais[campo]])) }));
  }

  let prazoMaximo;
  if (modo === 'editar') prazoMaximo = new Date(oferta.venderAte);
  else if (modo === 'caixa') prazoMaximo = caixa.prazoMaximo ? new Date(caixa.prazoMaximo) : null;
  else prazoMaximo = prazoPadraoSemCaixa({ agora, modoDemo });

  const categorias = modo === 'livre'
    ? CATEGORIAS_LIVRES
    : CATEGORIAS.filter((c) => c.valor === (caixa?.categoria ?? oferta?.categoria));

  const opcoesPrazo = prazoMaximo ? opcoesDePrazo(prazoMaximo, agora) : [];

  const alterar = useCallback((campo, valor) => {
    setValores((atuais) => {
      const novos = { ...atuais, [campo]: valor };
      if (campo === 'categoria' && modo === 'livre') novos.emoji = emojiDe(valor);
      return novos;
    });
    setTocados((atuais) => (atuais.includes(campo) ? atuais : [...atuais, campo]));
    setErros((atuais) => {
      if (!(campo in atuais)) return atuais;
      const resto = { ...atuais };
      delete resto[campo];
      return resto;
    });
  }, [modo]);

  const validar = () => {
    const novos = validarOferta(valores, { agora: new Date(), prazoMaximo });
    if (modo === 'caixa' && !caixa.podeAnunciar) novos.geral = caixa.motivoBloqueio;
    if (modo === 'livre' && CATEGORIAS_COM_FRIO.includes(valores.categoria)) {
      novos.categoria = 'Peixe e queijo só podem ser anunciados a partir de uma caixa.';
    }
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const enviar = async () => {
    if (!validar()) return { ok: false };
    const convertidos = {
      produto: String(valores.produto).trim(),
      categoria: valores.categoria,
      emoji: valores.emoji,
      unidade: valores.unidade,
      quantidade: lerNumero(valores.quantidade),
      precoNormal: lerNumero(valores.precoNormal),
      precoXepa: lerNumero(valores.precoXepa),
      venderAte: new Date(valores.venderAte).toISOString(),
      aceitaDoacao: Boolean(valores.aceitaDoacao),
    };
    setEnviando(true);
    try {
      let salva;
      if (modo === 'editar') {
        salva = await atualizarOferta(oferta.id, { ...semCamposCalculados(oferta), ...convertidos });
      } else {
        const daCaixa = modo === 'caixa';
        salva = await criarOferta({
          ...convertidos,
          caixaId: daCaixa ? caixa.id : null,
          fonteCaixa: daCaixa ? caixa.fonte : null,
          temperaturaC: daCaixa ? caixa.temperaturaC : null,
          conferidaEm: daCaixa ? caixa.leituraEm : null,
          banca: BANCA_DO_FEIRANTE,
          feira: FEIRA,
          distanciaM: DISTANCIA_DEMO_M,
          status: 'ativa',
          criadaEm: new Date().toISOString(),
        });
      }
      return { ok: true, oferta: salva };
    } catch (falha) {
      setErros({ geral: falha.message });
      return { ok: false };
    } finally {
      setEnviando(false);
    }
  };

  const precoNormal = lerNumero(valores.precoNormal);
  return {
    modo,
    valores,
    erros,
    alterar,
    categorias,
    precoSugerido: calcularPrecoSugerido(precoNormal),
    prazoMaximo,
    opcoesPrazo,
    validar,
    enviando,
    enviar,
  };
}
