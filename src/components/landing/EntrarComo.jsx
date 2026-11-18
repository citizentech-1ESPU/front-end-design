'use client';
import Link from 'next/link';
import { usePerfil } from '@/hooks/usePerfil';

// Link que entra no site já guardando o perfil no navegador (usePerfil), sem cadastro nem login
export default function EntrarComo({ perfil, href, variante = 'primario', children }) {
  const { definirPerfil } = usePerfil();
  return (
    <Link href={href} onClick={() => definirPerfil(perfil)} className={`botao botao-${variante}`}>
      {children}
    </Link>
  );
}
