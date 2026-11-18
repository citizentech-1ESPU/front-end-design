import { formatarPreco } from './precos';
import { formatarHora } from './tempo';

const ARTIGOS = { kg: 'o kg', dúzia: 'a dúzia', maço: 'o maço', unidade: 'a unidade' };

// No WhatsApp o espaço inseparável do preço vira espaço comum
const preco = (valor) => formatarPreco(valor).replace(/ /g, ' ');

// Link wa.me com a oferta e o endereço dela no site (não precisa de API)
export function linkWhatsApp(oferta, origem) {
  const unidade = ARTIGOS[oferta.unidade] ?? oferta.unidade;
  const texto = `Xepa na ${oferta.banca}: ${oferta.produto} de ${preco(oferta.precoNormal)} por ${preco(oferta.precoXepa)} ${unidade}, `
    + `até ${formatarHora(oferta.venderAte)}. Reserve: ${origem}/xepa/oferta?id=${oferta.id}`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
