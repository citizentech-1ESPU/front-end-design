import { formatarHora } from '@/domain/tempo';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import IceAlert from './IceAlert';
import StatusPill from './StatusPill';
import TemperatureReading from './TemperatureReading';
import TimeBar from './TimeBar';
import { dadosDoEstado } from './estados';

// Cartão de uma caixa térmica na tela "Suas caixas". Só mostra o que recebe: estado, prazo e bloqueio
// já vêm calculados do useCaixas (Dani). O estado aparece na etiqueta e na barra do tempo fora do frio.
export default function BoxCard({ caixa, onAnunciar }) {
  const { apoio } = dadosDoEstado(caixa.estado);
  const textoApoio =
    caixa.estado === 'xepa' && caixa.prazoMaximo ? `Venda ou doe hoje, até ${formatarHora(caixa.prazoMaximo)}.` : apoio;
  const estadoJaExplica = caixa.estado === 'descarte' || caixa.estado === 'sensor';

  return (
    <article className="flex flex-col gap-4 rounded-card border border-rule p-5">
      <header className="flex items-start justify-between gap-2">
        <h2 className="font-display font-extrabold">{caixa.nome}</h2>
        <StatusPill estado={caixa.estado} />
      </header>

      <TemperatureReading temperaturaC={caixa.temperaturaC} taxaCh={caixa.taxaCh} />
      <TimeBar minutosFora={caixa.minutosFora} />
      <p className="font-bold">{textoApoio}</p>

      {caixa.estado === 'gelo' && <IceAlert minutosAte5C={caixa.minutosAte5C} />}

      {(caixa.fonte === 'simulada' || caixa.leituraAntiga) && (
        <div className="flex flex-wrap gap-2">
          {caixa.fonte === 'simulada' && <Badge>simulação</Badge>}
          {caixa.leituraAntiga && caixa.leituraEm && (
            <Badge tipo="warn">Sem leitura recente (última às {formatarHora(caixa.leituraEm)})</Badge>
          )}
        </div>
      )}

      {caixa.podeAnunciar ? (
        <Button variante={caixa.estado === 'xepa' ? 'primario' : 'secundario'} onClick={() => onAnunciar(caixa.id)}>
          Anunciar na xepa
        </Button>
      ) : (
        !estadoJaExplica && caixa.motivoBloqueio && <p className="text-sm font-bold text-muted">{caixa.motivoBloqueio}</p>
      )}
    </article>
  );
}
