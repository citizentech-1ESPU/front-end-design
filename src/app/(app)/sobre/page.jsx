import AppHeader from '@/components/layout/AppHeader';
import { EQUIPE, FICHA, ODS, PASSOS } from './conteudo';

export const metadata = { title: 'Sobre a Xepa Certa' };

function Secao({ id, titulo, children }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="font-display text-xl font-extrabold">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

// Ficha da CitizenTech, como funciona, ODS e equipe (pedidos no PDF da GS)
export default function Sobre() {
  return (
    <>
      <AppHeader titulo="Sobre a Xepa Certa" subtitulo="CitizenTech da feira livre" voltarPara="/" />
      <main className="flex max-w-3xl flex-col gap-8 px-4 pb-10 pt-4 md:px-8">
        <Secao id="ficha" titulo="Ficha da CitizenTech">
          <dl className="flex flex-col gap-3 rounded-card bg-paper-2 p-4">
            {FICHA.map((item) => (
              <div key={item.campo}>
                <dt className="text-sm font-bold text-muted">{item.campo}</dt>
                <dd>{item.valor}</dd>
              </div>
            ))}
          </dl>
        </Secao>

        <Secao id="como-funciona" titulo="Como funciona">
          <ol className="flex flex-col gap-3">
            {PASSOS.map((passo, indice) => (
              <li key={passo.titulo} className="flex gap-3 border-t border-rule pt-4">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-ink">
                  {indice + 1}
                </span>
                <span>
                  <strong className="block">{passo.titulo}</strong>
                  {passo.texto}
                </span>
              </li>
            ))}
          </ol>
        </Secao>

        <Secao id="ods" titulo="ODS que a Xepa Certa atende">
          <ul className="flex flex-col gap-3">
            {ODS.map((ods) => (
              <li key={ods.nome} className="border-t border-rule pt-4">
                <strong className="block">{ods.nome}</strong>
                <span className="block text-sm text-muted">{ods.meta}</span>
                <span className="mt-1 block">{ods.como}</span>
              </li>
            ))}
          </ul>
        </Secao>

        <Secao id="equipe" titulo="Time SafeTech">
          <ul className="flex flex-col gap-2">
            {EQUIPE.map((pessoa) => (
              <li key={pessoa.rm} className="border-t border-rule pt-4">
                <strong className="block">{pessoa.nome}</strong>
                <span className="block text-sm text-muted">{pessoa.parte}</span>
                <span className="block text-sm text-muted">{pessoa.rm}</span>
              </li>
            ))}
          </ul>
        </Secao>

        <footer className="flex flex-col gap-1 text-center text-sm text-muted">
          <p>Bancas, preços e pessoas deste site são fictícios.</p>
          <p>Global Solution 2026.2 da FIAP, time SafeTech.</p>
        </footer>
      </main>
    </>
  );
}
