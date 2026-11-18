import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import QuantityStepper from './QuantityStepper';

describe('QuantityStepper', () => {
  it('respeita o mínimo e o máximo e mostra a unidade', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<QuantityStepper valor={1} min={1} max={3} unidade="kg" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Diminuir' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar' }));
    expect(onChange).toHaveBeenCalledWith(2);
    rerender(<QuantityStepper valor={3} min={1} max={3} unidade="kg" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Aumentar' })).toBeDisabled();
    expect(screen.getByText('3 kg')).toBeInTheDocument();
  });
});
