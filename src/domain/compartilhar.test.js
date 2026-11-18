import { it, expect } from 'vitest';
import { linkWhatsApp } from './compartilhar';

it('monta o link do WhatsApp com a oferta e o endereço dela', () => {
  const oferta = {
    id: '7', produto: 'Tilápia (filé)', banca: 'Banca Mar Azul', precoNormal: 39.9, precoXepa: 29.9,
    unidade: 'kg', venderAte: '2026-11-15T13:50:00-03:00',
  };
  const link = linkWhatsApp(oferta, 'https://xepa-certa.vercel.app');
  expect(link.startsWith('https://wa.me/?text=')).toBe(true);
  expect(decodeURIComponent(link.replace('https://wa.me/?text=', ''))).toBe(
    'Xepa na Banca Mar Azul: Tilápia (filé) de R$ 39,90 por R$ 29,90 o kg, até 13h50. Reserve: https://xepa-certa.vercel.app/xepa/oferta?id=7',
  );
});
