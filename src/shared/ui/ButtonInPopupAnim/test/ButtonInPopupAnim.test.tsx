import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ButtonInPopupAnim from '../ButtonInPopupAnim';

describe('ButtonInPopupAnim', () => {
  test('тестирование пропса text и onClick', () => {
    const fn = jest.fn();

    render(
      <ButtonInPopupAnim
        onClick={fn}
        text="textTest"
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
    expect(fn.mock.calls.length).toBe(1);
    expect(btn.childNodes[0].textContent).toBe('textTest');
  });
});
