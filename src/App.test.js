import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const setup = () => {
    const utils = render(<App />);
    const commandField = utils.getByLabelText('command');
    return { commandField, ...utils };
};

test("it shouldn't allow any letters besides fblr", () => {
    const { commandField } = setup();

    fireEvent.change(commandField, { target: { value: 'shkdfjhlaskdj' } });
    expect(commandField.value).toBe('');

    fireEvent.change(commandField, { target: { value: 'ffrff' } });
    expect(commandField.value).toBe('ffrff');
});
test('test command query', () => {
    const { commandField, getByTestId } = setup();
    fireEvent.change(commandField, { target: { value: 'ffrffrfflff' } });
    const position = getByTestId('position');
    expect(position).toHaveTextContent('Position: (16, 12)');
});

test('obstacles input only accept numbers', () => {
    const { getByLabelText } = setup();
    const obsX = getByLabelText('new-obs-x');
    const obsY = getByLabelText('new-obs-y');

    fireEvent.change(obsX, { target: { value: 'asdf' } });
    expect(obsX.value).toBe('0');

    fireEvent.change(obsY, { target: { value: 'dfds' } });
    expect(obsY.value).toBe('0');

    fireEvent.change(obsX, { target: { value: '12' } });
    expect(obsX.value).toBe('12');

    fireEvent.change(obsY, { target: { value: '14' } });
    expect(obsY.value).toBe('14');
});

test('add obstacle & smash into it', () => {
    const { commandField, getByLabelText, getByTestId } = setup();
    const obsX = getByLabelText('new-obs-x');
    const obsY = getByLabelText('new-obs-y');
    const obsButton = getByLabelText('new-obs-button');

    fireEvent.change(obsX, { target: { value: '14' } });
    fireEvent.change(obsY, { target: { value: '14' } });
    fireEvent(
        obsButton,
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        })
    );

    fireEvent.change(commandField, { target: { value: 'ffrff' } });
    const position = getByTestId('position');
    expect(position).toHaveTextContent('Position: (13, 14) STOPPED');
});
