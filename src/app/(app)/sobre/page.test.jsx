import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Sobre from './page';

describe('sobre', () => {
  it('mostra a equipe com nome completo e RM e os ODS', () => {
    render(<Sobre />);
    [
      'Pedro Passos Corsini', 'RM573493', 'Daniel Gomes Torres', 'RM573436', 'Henrique Lira', 'RM571009',
      'Pedro Thyago de Araújo Santos', 'RM570939', 'ODS 2', 'ODS 3', 'ODS 11',
    ].forEach((texto) => expect(screen.getAllByText(texto, { exact: false }).length).toBeGreaterThan(0));
  });
});
