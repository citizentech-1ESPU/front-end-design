import { formatarHora } from '@/domain/tempo';
import Button from '@/components/ui/Button';
import FormField, { CLASSE_CAMPO } from '@/components/ui/FormField';
import QuantityStepper from '@/components/ui/QuantityStepper';

// Formulário de reserva do freguês (tipo "compra") e de retirada da ONG (tipo "doacao").
// Sem pagamento e sem login: só quantidade, apelido e, na doação, o horário da retirada.
export default function ReservaForm({
  tipo, valores, erros = {}, disponivel, unidade, venderAte, opcoesRetirada = [], precisaCaixaTermica, enviando, onAlterar, onEnviar,
}) {
  const doacao = tipo === 'doacao';
  const semHorario = doacao && opcoesRetirada.length === 0;

  function enviar(evento) {
    evento.preventDefault();
    onEnviar();
  }

  let rotuloBotao = doacao ? 'Combinar retirada' : `Reservar e retirar até ${formatarHora(venderAte)}`;
  if (enviando) rotuloBotao = 'Enviando…';

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-4">
      {erros.geral && (
        <p role="alert" className="rounded-control bg-bad-bg p-3 font-bold text-bad">
          {erros.geral}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-muted">Quantidade</p>
        <QuantityStepper
          valor={Number(valores.quantidade) || 1}
          min={1}
          max={Math.max(1, disponivel)}
          unidade={unidade}
          onChange={(valor) => onAlterar('quantidade', valor)}
        />
        {erros.quantidade && (
          <p role="alert" className="text-sm font-bold text-bad">
            {erros.quantidade}
          </p>
        )}
      </div>

      <FormField
        id="apelido"
        rotulo={doacao ? 'Nome da ONG ou apelido' : 'Seu apelido'}
        dica={doacao ? undefined : 'Só um apelido, para a banca chamar você.'}
        erro={erros.apelido}
      >
        <input
          id="apelido"
          type="text"
          maxLength={30}
          autoComplete="nickname"
          value={valores.apelido ?? ''}
          onChange={(evento) => onAlterar('apelido', evento.target.value)}
          aria-invalid={erros.apelido ? 'true' : undefined}
          className={CLASSE_CAMPO}
        />
      </FormField>

      {doacao &&
        (semHorario ? (
          <p className="rounded-control bg-warn-bg p-3 font-bold text-warn">Não dá mais tempo de combinar retirada.</p>
        ) : (
          <FormField id="retirarAte" rotulo="Horário da retirada" erro={erros.retirarAte}>
            <select
              id="retirarAte"
              value={valores.retirarAte ?? ''}
              onChange={(evento) => onAlterar('retirarAte', evento.target.value)}
              className={CLASSE_CAMPO}
            >
              <option value="">Escolha o horário</option>
              {opcoesRetirada.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>
          </FormField>
        ))}

      {doacao && precisaCaixaTermica && (
        <p className="rounded-control bg-ice-bg p-3 font-bold text-ice">
          Peixe e queijo: leve caixa térmica.
        </p>
      )}
      {erros.temCaixaTermica && (
        <p role="alert" className="text-sm font-bold text-bad">
          {erros.temCaixaTermica}
        </p>
      )}

      <Button type="submit" disabled={enviando || semHorario}>
        {rotuloBotao}
      </Button>

      {!doacao && <p className="text-center text-sm text-muted">Sem pagamento pelo site. Você paga na banca.</p>}
    </form>
  );
}
