'use client';
import { useRouter } from 'next/navigation';
import { useCaixas } from '@/hooks/useCaixas';
import { formatarHora } from '@/domain/tempo';
import BoxCard from '@/components/caixa/BoxCard';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

// Suas caixas: as caixas térmicas da banca, que se atualizam sozinhas a cada 20 s (useCaixas, Dani)
export default function SuasCaixas() {
  const router = useRouter();
  const { caixas, carregando, erro, atualizadoEm } = useCaixas();

  return (
    <>
      <AppHeader titulo="Suas caixas" subtitulo="Banca Mar Azul, feira da Av. Eng. Caetano Álvares" />
      <main className="flex flex-col gap-4 px-4 pb-24 pt-4 md:px-8 md:pb-12">
        {atualizadoEm && (
          <p role="status" className="text-sm text-muted">
            {`Atualizado às ${formatarHora(atualizadoEm)}`}
          </p>
        )}
        {erro && <p className="rounded-control bg-warn-bg p-3 text-sm font-bold text-warn">{erro}</p>}

        {carregando ? (
          <LoadingState />
        ) : (
          <div className="grid items-start gap-4 md:grid-cols-2">
            {caixas.map((caixa) => (
              <BoxCard key={caixa.id} caixa={caixa} onAnunciar={(id) => router.push(`/feirante/anunciar?caixa=${id}`)} />
            ))}
          </div>
        )}

        <div className="md:max-w-sm">
          <Button variante="secundario" href="/feirante/anunciar">
            Anunciar fruta ou verdura
          </Button>
        </div>
      </main>
      <BottomNav perfil="feirante" ativa="caixas" />
    </>
  );
}
