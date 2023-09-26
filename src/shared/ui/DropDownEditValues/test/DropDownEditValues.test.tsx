import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { OptionsType } from '../../DropDown/type';
import { DropDownEditValues } from '../ui/DropDownEditValues';

describe('DropDownEditValues', () => {
  let listOptions: OptionsType[] = [];
  beforeEach(() => {
    listOptions = [
      {
        label: 'test1',
        value: 'test1'
      },
      {
        label: 'test2',
        value: 'test2'
      },
      {
        label: 'test3',
        value: 'test3'
      }
    ];
  });
  test('проверка отрисовки компонента', () => {
    render(
      <DropDownEditValues
        deleteValue={() => null}
        onChange={() => null}
        values={listOptions}
      />
    );

    const list = screen.getByTestId('list_Option');
    listOptions.forEach(item => {
      expect(
        list.querySelector(`input[value="${item.label}"]`)
      ).toBeInTheDocument();
    });
  });
  test('проверка функционала удаления позиции из dropdown', () => {
    const fnCLick = jest.fn();
    render(
      <DropDownEditValues
        deleteValue={fnCLick}
        onChange={() => null}
        values={listOptions}
      />
    );
    const list = screen.getByTestId('list_Option');
    fireEvent(
      list.querySelector(`div[data-deleteValue="${listOptions[0].label}"]`),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    expect(fnCLick).toHaveBeenCalledWith(listOptions[0].value);
  });
  test('функционала редактирование строки', () => {
    const fnChange = jest.fn();
    render(
      <DropDownEditValues
        deleteValue={() => null}
        onChange={fnChange}
        values={listOptions}
      />
    );
    const list = screen.getByTestId('list_Option');
    const input = list.querySelector(`input[value="${listOptions[0].label}"]`);
    fireEvent.input(input, {
      target: {
        value: 'testChange'
      }
    });
    expect(fnChange).toHaveBeenCalledWith(listOptions[0].value, 'testChange');
  });
});
