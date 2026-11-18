import Badge from '@/components/ui/Badge';

// Selo da RN8: só oferta que saiu de caixa com sensor diz "temperatura conferida".
// Caixa simulada avisa que é simulação; fruta e verdura (sem caixa) dizem "sem frio".
export default function SeloTemperatura({ fonteCaixa }) {
  if (fonteCaixa === 'sensor') {
    return (
      <Badge tipo="ok">
        <span>temperatura conferida</span>
      </Badge>
    );
  }
  if (fonteCaixa === 'simulada') {
    return (
      <Badge tipo="ok">
        <span>conferida (simulação)</span>
      </Badge>
    );
  }
  return <Badge>sem frio</Badge>;
}
