import { dadosDoEstado } from './estados';

// Etiqueta do estado da caixa, sempre escrita (quem não distingue cores ou está com a tela no sol lê a palavra).
// Na hora da xepa ela vira a plaquinha amarela da feira, inclinada como a placa da logo.
// No gelo e sem leitura, a etiqueta pisca como o LED da caixa (para com movimento reduzido).
export default function StatusPill({ estado }) {
  const { rotulo, cores, piscar, placa } = dadosDoEstado(estado);
  const forma = placa ? 'plaquinha font-display text-base font-extrabold' : 'text-sm font-bold';
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-control px-3 py-1 ${forma} ${cores} ${piscar ? 'piscar' : ''}`}>
      {rotulo}
    </span>
  );
}
