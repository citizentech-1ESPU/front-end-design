import { TEMPO_LIMITE_API_MS } from '@/domain/constantes';
import { lerConfig } from './config';

// Erro com mensagem pronta para a tela e o status HTTP (0 quando nem chegou ao servidor)
export class ErroApi extends Error {
  constructor(mensagem, status = 0) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

// Cada chamada desiste depois de 8 s, para nunca ficar carregando para sempre
export function sinalDeTempoLimite() {
  return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(TEMPO_LIMITE_API_MS)
    : undefined;
}

// Traduz a falha do fetch para o tom da feira
export function traduzirFalha(falha) {
  if (falha instanceof ErroApi) return falha;
  if (falha?.name === 'TimeoutError' || falha?.name === 'AbortError') {
    return new ErroApi('A conexão está lenta. Tente de novo.');
  }
  return new ErroApi('Sem conexão com o servidor. Tente de novo.');
}

// Chamada ao MockAPI: caminho como '/ofertas' ou '/ofertas/7'
export async function requisitar(caminho, { metodo = 'GET', corpo } = {}) {
  const { mockapiUrl } = lerConfig();
  let resposta;
  try {
    resposta = await fetch(`${mockapiUrl}${caminho}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: sinalDeTempoLimite(),
    });
  } catch (falha) {
    throw traduzirFalha(falha);
  }
  if (!resposta.ok) throw new ErroApi('O servidor não respondeu. Tente de novo.', resposta.status);
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}
