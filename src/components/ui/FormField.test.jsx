import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FormField from './FormField';

describe('FormField', () => {
  it('liga o rótulo ao campo e mostra dica e erro', () => {
    render(
      <FormField id="precoXepa" rotulo="Preço da xepa" dica="Sugestão: 25% mais barato." erro="O preço da xepa precisa ser menor que o normal.">
        <input id="precoXepa" />
      </FormField>,
    );
    expect(screen.getByLabelText('Preço da xepa')).toBeInTheDocument();
    expect(screen.getByText('Sugestão: 25% mais barato.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('O preço da xepa precisa ser menor que o normal.');
  });
});
