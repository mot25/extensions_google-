import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import SimpleButton from '../ui/SimpleButton';
import styles from '../ui/SimpleButton.module.scss';

describe('SimpleButton', () => {
  test('рендер текста в кнопки ', () => {
    render(
      <SimpleButton
        onClick={() => null}
        text="Hello world"
      />
    );
    const button = screen.getByText('Hello world');
    expect(button).toBeInTheDocument();
  });
  test('размер кнопки через пропс wd', () => {
    render(
      <SimpleButton
        onClick={() => null}
        text="Hello world"
        wd="100px"
      />
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveStyle({ width: '100px' });
  });
  test('проверка состоянии кнопки через пропс bg', () => {
    render(
      <SimpleButton
        onClick={() => null}
        text="Hello world"
        wd="100px"
        bg="red"
      />
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveStyle({ backgroundColor: 'red' });
  });
  test('проверка состоянии кнопки через пропс addStyle', () => {
    render(
      <SimpleButton
        onClick={() => null}
        text="Hello world"
        addStyle={{
          display: 'none',
          background: 'black'
        }}
      />
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveStyle({
      display: 'none',
      background: 'black'
    });
  });
  test('проверка состоянии кнопки через пропс addClassName', () => {
    render(
      <SimpleButton
        onClick={() => null}
        text="Hello world"
        addClassName={'test-class'}
      />
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('test-class');
  });
  test('проверка состоянии кнопки через пропс disabled', () => {
    render(
      <SimpleButton
        onClick={() => null}
        text="Hello world"
        disabled
      />
    );

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass(styles.button__disabled);
  });
  test('Работает ли клик на кнопку', () => {
    const fnClick = jest.fn();
    render(
      <SimpleButton
        onClick={fnClick}
        text=""
      />
    );
    const btn = screen.getByTestId('btn');
    fireEvent(
      btn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    expect(fnClick.mock.calls.length).toEqual(1);
  });
});
