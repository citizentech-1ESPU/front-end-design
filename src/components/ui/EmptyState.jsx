import Button from './Button';

// Lista vazia: explica o que está acontecendo e, se tiver, oferece o próximo passo
export default function EmptyState({ mensagem, rotuloAcao, onAcao, hrefAcao }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-control border border-dashed border-muted p-6 text-center">
      <p className="text-muted">{mensagem}</p>
      {rotuloAcao && (
        <Button variante="secundario" onClick={onAcao} href={hrefAcao}>
          {rotuloAcao}
        </Button>
      )}
    </div>
  );
}
