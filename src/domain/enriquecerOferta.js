import { linkWhatsApp } from './compartilhar';
import { disponivel, estaAtiva } from './regras';

// Campos que o site calcula e que não vão de volta para o MockAPI
export const CAMPOS_CALCULADOS = ['disponivel', 'ativa', 'linkWhatsApp', 'podeDoar', 'motivoDoacao'];

// Oferta do MockAPI + disponivel, ativa e linkWhatsApp (o objeto oferta do contrato)
export function enriquecerOferta(oferta, reservas, { agora, origem }) {
  return {
    ...oferta,
    disponivel: disponivel(oferta, reservas),
    ativa: estaAtiva(oferta, agora),
    linkWhatsApp: linkWhatsApp(oferta, origem),
  };
}

// Tira os campos calculados antes de um PUT (o MockAPI recebe o objeto inteiro)
export function semCamposCalculados(oferta) {
  return Object.fromEntries(Object.entries(oferta).filter(([campo]) => !CAMPOS_CALCULADOS.includes(campo)));
}
