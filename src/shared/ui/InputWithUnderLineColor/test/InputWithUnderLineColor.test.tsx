import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import InputWithUnderLineColor from '../ui/InputWithUnderLineColor';
import styles from './InputWithUnderLineColor.module.scss';

// wrapperInput
// input
describe('InputWithUnderLineColor', () => {
  test('тестирование пропса placeholder', () => {
    render(
      <InputWithUnderLineColor
        onChange={() => null}
        value="value"
        placeholder="placeholderTest"
      />
    );
    expect(screen.getByPlaceholderText('placeholderTest')).toBeInTheDocument();
  });
  test('тестирование пропса addStyle', () => {
    render(
      <InputWithUnderLineColor
        onChange={() => null}
        value="value"
        addStyle={{
          opacity: 0
        }}
      />
    );
    const wrapperInput = screen.getByTestId('wrapperInput');
    expect(wrapperInput).toHaveStyle({
      opacity: 0
    });
  });
  test('тестирование пропса placeholder size=s', () => {
    render(
      <InputWithUnderLineColor
        onChange={() => null}
        value="value"
        size="s"
      />
    );
    expect(screen.getByTestId('input')).toHaveClass(styles.input__small);
  });
  test('тестирование пропса placeholder size=b', () => {
    render(
      <InputWithUnderLineColor
        onChange={() => null}
        value="value"
        size="b"
      />
    );
    expect(screen.getByTestId('input')).not.toHaveClass(styles.input__small);
  });
});
