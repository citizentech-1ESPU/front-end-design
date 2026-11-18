// localStorage que nunca quebra a tela: navegador bloqueado, cheio ou renderização no build devolvem o padrão.
export function lerLocal(chave, padrao) {
  if (typeof window === 'undefined') return padrao;
  try {
    const texto = window.localStorage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch {
    return padrao;
  }
}

export function gravarLocal(chave, valor) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // sem espaço ou bloqueado: o site segue funcionando, só não lembra
  }
}
