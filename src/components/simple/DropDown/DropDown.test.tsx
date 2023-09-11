import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { OptionsType } from '@/type/components.dto';

import DropDown from './DropDown';

describe('DropDown', () => {
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
  test('проверка title и списка', () => {
    render(
      <DropDown
        list={listOptions}
        onChange={() => null}
        title="titleTest"
      />
    );
    const btnTitle = screen.getByTestId('btn_title');
    expect(btnTitle).toHaveTextContent('titleTest');
    listOptions.forEach(elList => {
      expect(screen.queryAllByText(elList.label)).toHaveLength(1);
      expect(screen.getByText(elList.label)).toBeInTheDocument();
    });
  });
  test('проверка видимости', () => {
    const changeShowFn = jest.fn();
    render(
      <DropDown
        onChange={changeShowFn}
        title="title"
        list={listOptions}
      />
    );
    const btnTitle = screen.getByTestId('btn_title');
    const list = screen.getByTestId('listOptions');
    fireEvent(
      btnTitle,
      new MouseEvent('click', {
        cancelable: true,
        bubbles: true
      })
    );
    expect(list).toBeVisible();
    fireEvent(
      btnTitle,
      new MouseEvent('click', {
        cancelable: true,
        bubbles: true
      })
    );
    expect(list).not.toBeVisible();
  });
  test('обработка нажатия на элемент', () => {
    const changeShowFn = jest.fn();
    render(
      <DropDown
        onChange={changeShowFn}
        title="title"
        list={listOptions}
      />
    );
    fireEvent(
      screen.getByText(listOptions[0].label),
      new MouseEvent('click', {
        cancelable: true,
        bubbles: true
      })
    );
    expect(changeShowFn).toHaveBeenCalledWith(listOptions[0].value);
  });
});
