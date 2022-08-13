import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('test command query', () => {
    const { getByTestId } = render(<App />);
    const commandField = getByTestId('command');
    const position = getByTestId('position');

    fireEvent.change(commandField, { target: { value: 'ffrff' } });
    expect(position).toHaveTextContent('Position: (14, 14)');
});
