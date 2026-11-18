// Única porta de entrada das variáveis de ambiente. Os nomes ficam por extenso (process.env.NEXT_PUBLIC_...)
// porque o Next troca cada um pelo valor no build; desestruturar process.env quebra essa troca.
export function lerConfig() {
  const mockapiUrl = (process.env.NEXT_PUBLIC_MOCKAPI_URL ?? '').replace(/\/+$/, '');
  const canalId = process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID ?? '';
  const modoDemo = process.env.NEXT_PUBLIC_MODO_DEMO === 'true';
  return { mockapiUrl, canalId, modoDemo };
}
