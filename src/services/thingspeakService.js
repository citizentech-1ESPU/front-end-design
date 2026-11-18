import { ESTADOS, TEMP_MAX_VALIDA_C, TEMP_MIN_VALIDA_C } from '@/domain/constantes';
import { ErroApi, sinalDeTempoLimite, traduzirFalha } from './api';

// Campo vazio vira NaN (Number(null) daria 0, que pareceria uma leitura real)
const paraNumero = (valor) => (valor === null || valor === undefined || valor === '' ? Number.NaN : Number(valor));
const ouNull = (valor) => (Number.isFinite(valor) ? valor : null);

// Converte a última entrada do canal (design 6.4). Canal vazio (-1) ou sem data devolve null.
// Lixo escrito por terceiros (a chave de escrita fica no Wokwi público) marca a leitura como inválida.
export function interpretarFeed(feed) {
  if (!feed || typeof feed !== 'object' || !feed.created_at) return null;
  const temperaturaC = paraNumero(feed.field1);
  const minutosFora = paraNumero(feed.field2);
  const estadoCodigo = paraNumero(feed.field3);
  const taxaCh = paraNumero(feed.field4);
  const minutosRestantes = paraNumero(feed.field5);

  const numeros = [temperaturaC, minutosFora, estadoCodigo, taxaCh, minutosRestantes];
  const valida = numeros.every(Number.isFinite)
    && temperaturaC >= TEMP_MIN_VALIDA_C && temperaturaC <= TEMP_MAX_VALIDA_C
    && Number.isInteger(estadoCodigo) && estadoCodigo >= 0 && estadoCodigo < ESTADOS.length
    && minutosFora >= 0 && minutosRestantes >= 0;

  return {
    temperaturaC: ouNull(temperaturaC),
    minutosFora: ouNull(minutosFora),
    estadoCodigo: ouNull(estadoCodigo),
    taxaCh: ouNull(taxaCh),
    minutosRestantes: ouNull(minutosRestantes),
    leituraEm: feed.created_at,
    valida,
  };
}

// O ThingSpeak tem endereço próprio e libera CORS, então é lido direto do navegador, sem chave
export async function buscarUltimaLeitura(canalId) {
  if (!canalId || String(canalId) === '0') return null;
  let resposta;
  try {
    resposta = await fetch(`https://api.thingspeak.com/channels/${canalId}/feeds/last.json`, {
      signal: sinalDeTempoLimite(),
    });
  } catch (falha) {
    throw traduzirFalha(falha);
  }
  if (!resposta.ok) throw new ErroApi('O servidor não respondeu. Tente de novo.', resposta.status);
  return interpretarFeed(await resposta.json());
}
