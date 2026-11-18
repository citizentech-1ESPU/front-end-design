import { UNIDADES } from '@/domain/constantes';
import { formatarPreco } from '@/domain/precos';
import { formatarHora } from '@/domain/tempo';
import Button from '@/components/ui/Button';
import FormField, { CLASSE_CAMPO } from '@/components/ui/FormField';
import Toggle from '@/components/ui/Toggle';

// Mostra número com vírgula (39,9), do jeito que a pessoa digita
const paraCampo = (valor) => (typeof valor === 'number' ? String(valor).replace('.', ',') : valor ?? '');

// Formulário de anunciar (modo "caixa" ou "livre") e de editar oferta. Só apresenta:
// valores, erros, prazo e preço sugerido vêm do useOfertaForm (Dani).
export default function OfertaForm({
  modo, valores, erros = {}, categorias = [], precoSugerido, opcoesPrazo = [], enviando, onAlterar, onEnviar,
}) {
  const editar = modo === 'editar';
  const horaLimite = valores.venderAte ? formatarHora(valores.venderAte) : '';
  const campo = (nome) => ({
    id: nome,
    value: paraCampo(valores[nome]),
    onChange: (evento) => onAlterar(nome, evento.target.value),
    'aria-invalid': erros[nome] ? 'true' : undefined,
    className: CLASSE_CAMPO,
  });

  function enviar(evento) {
    evento.preventDefault();
    onEnviar();
  }

  let rotuloBotao = editar ? 'Salvar mudanças' : 'Publicar oferta';
  if (enviando) rotuloBotao = editar ? 'Salvando…' : 'Publicando…';

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-4">
      {erros.geral && (
        <p role="alert" className="rounded-control bg-bad-bg p-3 font-bold text-bad">
          {erros.geral}
        </p>
      )}

      <FormField id="produto" rotulo="Produto" erro={erros.produto}>
        <input type="text" autoComplete="off" {...campo('produto')} />
      </FormField>

      {categorias.length > 1 && (
        <FormField id="categoria" rotulo="Tipo" erro={erros.categoria}>
          <select {...campo('categoria')}>
            {categorias.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FormField id="quantidade" rotulo="Quantidade" erro={erros.quantidade}>
          <input type="text" inputMode="decimal" {...campo('quantidade')} />
        </FormField>
        <FormField id="unidade" rotulo="Unidade" erro={erros.unidade}>
          <select {...campo('unidade')}>
            {UNIDADES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField id="precoNormal" rotulo="Preço normal" erro={erros.precoNormal}>
          <input type="text" inputMode="decimal" {...campo('precoNormal')} />
        </FormField>
        <FormField id="precoXepa" rotulo="Preço da xepa" erro={erros.precoXepa}>
          <input type="text" inputMode="decimal" {...campo('precoXepa')} />
        </FormField>
      </div>

      {precoSugerido !== null && precoSugerido !== undefined && (
        <div className="flex flex-col gap-2 rounded-control bg-card p-3">
          <p className="text-sm text-muted">
            {`Sugestão: 25% mais barato (${formatarPreco(precoSugerido)}). Na xepa, o comum é de 20% a 30%.`}
          </p>
          <Button variante="secundario" onClick={() => onAlterar('precoXepa', precoSugerido)}>
            Usar sugestão
          </Button>
        </div>
      )}

      {editar ? (
        <FormField id="venderAte" rotulo="Vender até" dica="Dá para encurtar o prazo, nunca aumentar." erro={erros.venderAte}>
          <select {...campo('venderAte')}>
            {opcoesPrazo.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </FormField>
      ) : (
        <div className="flex flex-col gap-1 rounded-control bg-paper-2 p-3">
          <p className="font-bold">
            <span>{`Vender até ${horaLimite}`}</span>
          </p>
          <p className="text-sm text-muted">
            {modo === 'livre'
              ? 'Fruta e verdura saem até o fim da feira.'
              : 'O horário limite vem da caixa. Dá para encerrar antes, nunca depois.'}
          </p>
          {erros.venderAte && (
            <p role="alert" className="text-sm font-bold text-bad">
              {erros.venderAte}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Toggle
          id="aceitaDoacao"
          rotulo="Se sobrar, oferecer às ONGs"
          ligado={Boolean(valores.aceitaDoacao)}
          onChange={(ligado) => onAlterar('aceitaDoacao', ligado)}
        />
        <p className="text-sm text-muted">
          {`A ONG combina a retirada até ${horaLimite}. Peixe e queijo só vão para quem leva caixa térmica.`}
        </p>
      </div>

      <Button type="submit" disabled={enviando}>
        {rotuloBotao}
      </Button>
    </form>
  );
}
