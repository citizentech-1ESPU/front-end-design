'use client';
import { useCaixas } from '@/hooks/useCaixas';
import StatusPill from '@/components/caixa/StatusPill';
import TimeBar from '@/components/caixa/TimeBar';
import { dadosDoEstado } from '@/components/caixa/estados';

const umaCasa = (valor) => valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// O produto no hero da landing: as quatro caixas da banca, com a caixa 1 lida ao vivo do ThingSpeak.
// Usa o mesmo hook e os mesmos componentes das telas do feirante, só que em linhas compactas.
export default function PainelDeCaixas() {
  const { caixas, carregando, erro } = useCaixas();

  return (
    <figure className="painel" aria-labelledby="painel-legenda">
      <ul className="painel-lista">
        {carregando && <li className="painel-aviso">Lendo as caixas…</li>}
        {!carregando && erro && <li className="painel-aviso">{erro}</li>}
        {!carregando &&
          !erro &&
          caixas.map((caixa) => (
            <li key={caixa.id} className="painel-caixa">
              <div className="painel-topo">
                <p className="painel-nome">{caixa.nome}</p>
                <StatusPill estado={caixa.estado} />
              </div>
              <p className="painel-temp num">
                {caixa.temperaturaC === null || caixa.temperaturaC === undefined ? '-- °C' : `${umaCasa(caixa.temperaturaC)} °C`}
              </p>
              <TimeBar minutosFora={caixa.minutosFora} />
              <p className="painel-acao">{dadosDoEstado(caixa.estado).apoio}</p>
            </li>
          ))}
      </ul>
      <figcaption id="painel-legenda" className="painel-legenda">
        Caixa 1 lida agora do ThingSpeak. As outras três são simuladas, para mostrar todos os estados.
      </figcaption>
    </figure>
  );
}
