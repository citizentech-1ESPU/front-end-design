import Button from './Button';

// Erro com a mensagem no tom da feira (vem pronta do hook) e o botão "Tentar de novo"
export default function ErrorState({ mensagem, onTentarDeNovo }) {
  return (
    <div className="flex flex-col gap-3 rounded-control bg-bad-bg p-4">
      <p role="alert" className="font-bold text-bad">
        {mensagem}
      </p>
      <Button variante="secundario" onClick={onTentarDeNovo}>
        Tentar de novo
      </Button>
    </div>
  );
}
