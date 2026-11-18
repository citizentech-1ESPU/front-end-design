import Link from 'next/link';
import StatusPill from '@/components/caixa/StatusPill';
import EntrarComo from '@/components/landing/EntrarComo';
import PainelDeCaixas from '@/components/landing/PainelDeCaixas';
import TrocaDePerfil from '@/components/landing/TrocaDePerfil';
import './landing.css';

// Landing da Xepa Certa: apresenta a solução e leva cada perfil para a sua parte do site.
// Os fatos vêm do documento de design (ficha, entrevista com o feirante, regras da caixa).

const ANTES_E_DEPOIS = [
  { tema: 'Gelo', antes: 'Acaba perto do meio-dia.', depois: 'Aviso 15 minutos antes de passar de 5 °C.' },
  { tema: 'Na dúvida', antes: 'Decide pelo cheiro.', depois: 'A caixa conta o tempo fora do frio.' },
  { tema: 'Xepa', antes: 'No grito e na plaquinha.', depois: 'No celular, com prazo travado.' },
  { tema: 'Doação', antes: 'Difícil combinar a retirada.', depois: 'A ONG reserva e marca a hora.' },
];

const ESTADOS = [
  { estado: 'normal', quando: 'Menos de 2h acima de 5 °C', caixa: 'LED verde', fazer: 'Pode vender tranquilo.' },
  { estado: 'gelo', quando: 'Vai passar de 5 °C em 15 min', caixa: 'Verde piscando e bipe', fazer: 'Complete o gelo.' },
  { estado: 'xepa', quando: 'De 2h a 4h acima de 5 °C', caixa: 'LED amarelo', fazer: 'Venda ou doe hoje.' },
  { estado: 'descarte', quando: '4h ou mais acima de 5 °C', caixa: 'LED vermelho e alarme', fazer: 'Não venda nem doe.' },
];

export default function Landing() {
  return (
    <div className="lp">
      <a href="#conteudo" className="pular">
        Pular para o conteúdo
      </a>

      <header className="lp-nav">
        <nav aria-label="Principal" className="lp-pilula">
          <Link href="/" aria-label="Xepa Certa, página inicial" className="lp-marca">
            <img src="/logo/xepa-certa-logo-compacta.svg" alt="" width="95" height="52" />
          </Link>
          <ul className="lp-links">
            <li>
              <a href="#regra">Como a caixa decide</a>
            </li>
            <li>
              <Link href="/sobre">Sobre</Link>
            </li>
          </ul>
          <a href="#entrar" className="botao botao-primario botao-nav">
            Entrar
          </a>
        </nav>
      </header>

      <main id="conteudo">
        <section className="lp-hero" aria-labelledby="titulo-hero">
          <div className="container lp-hero-grade">
            <div className="lp-hero-texto">
              <h1 id="titulo-hero">A caixa avisa a hora da xepa.</h1>
              <p className="lead">Sensor na caixa térmica da feira, xepa no celular e sobra doada.</p>
              <div className="lp-acoes">
                <EntrarComo perfil="feirante" href="/feirante">
                  Sou feirante
                </EntrarComo>
                <EntrarComo perfil="fregues" href="/xepa" variante="secundario">
                  Quero comprar xepa
                </EntrarComo>
              </div>
            </div>
            <PainelDeCaixas />
          </div>
        </section>

        <section className="lp-secao lp-antes" aria-labelledby="titulo-antes">
          <div className="container">
            <h2 id="titulo-antes">Da plaquinha para o celular</h2>
            <table className="lp-tabela-antes">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="visually-hidden">Assunto</span>
                  </th>
                  <th scope="col">Hoje, na feira</th>
                  <th scope="col">Com a Xepa Certa</th>
                </tr>
              </thead>
              <tbody>
                {ANTES_E_DEPOIS.map((linha) => (
                  <tr key={linha.tema}>
                    <th scope="row">{linha.tema}</th>
                    <td>{linha.antes}</td>
                    <td>{linha.depois}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lp-secao lp-perfis" aria-labelledby="titulo-perfis">
          <div className="container">
            <h2 id="titulo-perfis">Feirante anuncia, freguês reserva, ONG retira</h2>
            <TrocaDePerfil />
          </div>
        </section>

        <section className="lp-secao lp-fala" aria-labelledby="titulo-fala">
          <div className="container lp-fala-grade">
            <figure className="lp-foto" data-slot="feira" data-alt="A banca de peixe da feira de domingo da Av. Engenheiro Caetano Álvares, ou a caixa térmica do protótipo">
              <img
                src="/fotos/peixe-no-gelo.jpg"
                alt="Peixes inteiros sobre gelo numa banca de mercado"
                width="1000"
                height="1500"
                loading="lazy"
              />
            </figure>
            <blockquote className="lp-citacao">
              <h2 id="titulo-fala" className="visually-hidden">
                O que o feirante disse
              </h2>
              <p>“E se aquilo que sobra na feira pudesse se transformar em alimento, renda e oportunidade para muita gente?”</p>
              <footer>Feirante há mais de 20 anos, Zona Norte de São Paulo, em entrevista ao time em 8 de novembro de 2026.</footer>
            </blockquote>
          </div>
        </section>

        <section id="regra" className="lp-secao lp-regra" aria-labelledby="titulo-regra">
          <div className="container">
            <div className="lp-cabeca">
              <h2 id="titulo-regra">Duas horas, quatro horas</h2>
              <p className="lead">A caixa soma o tempo acima de 5 °C e não esquece quando esfria.</p>
            </div>
            <table className="lp-tabela-regra">
              <thead>
                <tr>
                  <th scope="col">Estado</th>
                  <th scope="col">Quando</th>
                  <th scope="col">Na caixa</th>
                  <th scope="col">O que fazer</th>
                </tr>
              </thead>
              <tbody>
                {ESTADOS.map((linha) => (
                  <tr key={linha.estado}>
                    <th scope="row">
                      <StatusPill estado={linha.estado} />
                    </th>
                    <td>{linha.quando}</td>
                    <td>{linha.caixa}</td>
                    <td>{linha.fazer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="lp-fonte">
              Regra das 2 e 4 horas da agência de alimentos da Austrália e Nova Zelândia (FSANZ). A caixa decide sozinha, mesmo sem internet.
            </p>
          </div>
        </section>

        <section id="entrar" className="lp-secao lp-fecho" aria-labelledby="titulo-entrar">
          <div className="container lp-fecho-grade">
            <div className="lp-fecho-texto">
              <h2 id="titulo-entrar">Abra no celular, ali na feira</h2>
              <p className="lead">Sem app para instalar e sem cadastro.</p>
              <ul className="lp-entradas">
                <li>
                  <EntrarComo perfil="feirante" href="/feirante">
                    Sou feirante
                  </EntrarComo>
                </li>
                <li>
                  <EntrarComo perfil="fregues" href="/xepa" variante="secundario">
                    Quero comprar xepa
                  </EntrarComo>
                </li>
                <li>
                  <EntrarComo perfil="ong" href="/ong" variante="secundario">
                    Sou de uma ONG
                  </EntrarComo>
                </li>
              </ul>
            </div>
            <div className="lp-fecho-tela" style={{ aspectRatio: '780 / 1126' }} data-slot="tela-oferta" data-kind="product" data-alt="Detalhe de uma oferta no celular">
              <img src="/telas/oferta.png" alt="Detalhe de uma oferta de tilápia, com o preço da xepa, o selo de temperatura conferida e a reserva" width="780" height="1126" loading="lazy" />
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-rodape">
        <div className="container lp-rodape-grade">
          <img src="/logo/xepa-certa-logo.svg" alt="Xepa Certa" width="141" height="96" className="lp-rodape-logo" />
          <div>
            <p className="lp-assinatura">
              Feito pelo time SafeTech para a Global Solution 2026.2 da FIAP. São Paulo, novembro de 2026.
            </p>
            <p className="lp-equipe">Pedro Passos Corsini, Daniel Gomes Torres, Henrique Lira e Pedro Thyago de Araújo Santos.</p>
            <p className="lp-rodape-links">
              <Link href="/sobre">Sobre o projeto</Link>
              <a href="https://github.com/citizentech-1ESPU/front-end-design">Código no GitHub</a>
            </p>
            <p data-credits className="lp-creditos">
              Foto: <a href="https://commons.wikimedia.org/wiki/File:Oweston_sting_fish_for_sale_at_Tsukiji_Fishmarket,_Tokyo-30.jpg">MichaelMaggs</a>{' '}
              (CC BY-SA 3.0, Wikimedia Commons).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
