'use client';
import { useCallback, useState } from 'react';
import { usePerfil } from '@/hooks/usePerfil';
import { useOfertas } from '@/hooks/useOfertas';
import { useReservas } from '@/hooks/useReservas';
import { CATEGORIAS_COM_FRIO } from '@/domain/constantes';
import { formatarHora } from '@/domain/tempo';
import ReservaForm from '@/components/formularios/ReservaForm';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import OfferCard from '@/components/oferta/OfferCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import Toast from '@/components/ui/Toast';
import Toggle from '@/components/ui/Toggle';

const VALORES_VAZIOS = { quantidade: 1, apelido: '', retirarAte: '' };

// Doações para retirar: ONG e cozinha solidária combinam a retirada antes do prazo seguro.
// Peixe e queijo só para quem confirma caixa térmica (RN6); a regra vem pronta em podeDoar.
export default function Doacoes() {
  const { temCaixaTermica, definirCaixaTermica } = usePerfil();
  const { ofertas, carregando, erro, recarregar, modoDemo, criarDemo } = useOfertas('ong', { temCaixaTermica });
  const { reservar, opcoesRetirada } = useReservas('doacao');
  const [aberta, setAberta] = useState(null); // id da oferta com o formulário aberto
  const [valores, setValores] = useState(VALORES_VAZIOS);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const fecharAviso = useCallback(() => setAviso(null), []);

  function abrir(oferta) {
    if (!oferta.podeDoar) return;
    setAberta(oferta.id);
    setValores(VALORES_VAZIOS);
    setErros({});
  }

  function alterar(campo, valor) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }));
    setErros((atuais) => ({ ...atuais, [campo]: undefined }));
  }

  async function combinar(oferta) {
    setEnviando(true);
    const resultado = await reservar({ ofertaId: oferta.id, ...valores, temCaixaTermica });
    setEnviando(false);
    if (resultado.ok) {
      setAberta(null);
      setAviso(`Retirada combinada para ${formatarHora(resultado.reserva.retirarAte)}. Leve sacolas e, para frios, a caixa térmica.`);
      recarregar();
    } else {
      setErros(resultado.erros ?? {});
    }
  }

  async function criarDemonstracao() {
    const resultado = await criarDemo();
    if (!resultado.ok) setAviso(resultado.erro);
  }

  let conteudo;
  if (carregando) conteudo = <LoadingState />;
  else if (erro) conteudo = <ErrorState mensagem={erro} onTentarDeNovo={recarregar} />;
  else if (ofertas.length === 0) {
    conteudo = (
      <EmptyState
        mensagem="Nenhuma doação agora. Volte mais perto do fim da feira."
        rotuloAcao={modoDemo ? 'Criar ofertas de demonstração' : undefined}
        onAcao={criarDemonstracao}
      />
    );
  } else {
    conteudo = (
      <ul className="flex flex-col gap-4">
        {ofertas.map((oferta) => (
          <li key={oferta.id} className="flex flex-col gap-2">
            <OfferCard oferta={oferta} disponivel={oferta.disponivel} onClick={() => abrir(oferta)} />
            {aberta === oferta.id ? (
              <section aria-label={`Combinar retirada de ${oferta.produto}`} className="rounded-card border-2 border-accent p-4">
                <ReservaForm
                  tipo="doacao"
                  valores={valores}
                  erros={erros}
                  disponivel={oferta.disponivel}
                  unidade={oferta.unidade}
                  venderAte={oferta.venderAte}
                  opcoesRetirada={opcoesRetirada(oferta)}
                  precisaCaixaTermica={CATEGORIAS_COM_FRIO.includes(oferta.categoria)}
                  enviando={enviando}
                  onAlterar={alterar}
                  onEnviar={() => combinar(oferta)}
                />
                <button type="button" onClick={() => setAberta(null)} className="mt-2 min-h-11 w-full font-bold text-muted underline">
                  Fechar
                </button>
              </section>
            ) : (
              <>
                <Button disabled={!oferta.podeDoar} onClick={() => abrir(oferta)}>
                  Combinar retirada
                </Button>
                {!oferta.podeDoar && oferta.motivoDoacao && <p className="text-sm font-bold text-muted">{oferta.motivoDoacao}</p>}
              </>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <AppHeader titulo="Doações para retirar" subtitulo="Feira da Av. Eng. Caetano Álvares, hoje" />
      <main className="flex flex-col gap-4 px-4 pb-24">
        <div className="flex flex-col gap-1 rounded-card bg-paper-2 p-4">
          <Toggle id="caixaTermica" rotulo="Temos caixa térmica" ligado={temCaixaTermica} onChange={definirCaixaTermica} />
          <p className="text-sm text-muted">
            {temCaixaTermica ? 'Com caixa térmica: peixe e queijo liberados' : 'Sem caixa térmica: só frutas e verduras'}
          </p>
        </div>
        {conteudo}
        <p className="text-center text-sm text-muted">Nada que passou do limite aparece aqui.</p>
      </main>
      <div aria-hidden="true" className="h-20" />
      {aviso && <Toast mensagem={aviso} onFechar={fecharAviso} />}
      <BottomNav perfil="ong" ativa="doacoes" />
    </>
  );
}
