import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ViewerType } from '@/shared/type';

import ViewerForPaste from '../ui/ViewerForPaste';
import styles from '../ui/ViewerForPaste.module.scss';

const viewer: ViewerType = {
  Attributes: [],
  Caption: 'viewerName',
  Icon: 'Icon',
  Id: 'Id',
  Name: 'Name',
  isSelected: false,
  order: 1
};

describe('ViewerForPaste', () => {
  test('проверка пропса isEven = true', () => {
    render(
      <ViewerForPaste
        viewer={viewer}
        changeOrderViewerInEntities={() => null}
        changeSelectedToggleiewer={() => null}
        deleteView={() => null}
        isEven
        renameViewer={() => null}
      />
    );
    const listWrapper = screen.getByTestId('listWrapper');
    expect(listWrapper).toHaveClass(styles.viewerWrapper__even);
  });
  test('проверка пропса isEven = false', () => {
    render(
      <ViewerForPaste
        viewer={viewer}
        changeOrderViewerInEntities={() => null}
        changeSelectedToggleiewer={() => null}
        deleteView={() => null}
        isEven={false}
        renameViewer={() => null}
      />
    );
    const listWrapper = screen.getByTestId('listWrapper');
    expect(listWrapper).not.toHaveClass(styles.viewerWrapper__even);
  });
  test('название вида есть в input', () => {
    render(
      <ViewerForPaste
        viewer={viewer}
        changeOrderViewerInEntities={() => null}
        changeSelectedToggleiewer={() => null}
        deleteView={() => null}
        isEven={false}
        renameViewer={() => null}
      />
    );
    const input = screen
      .getByTestId('wrapperNameViewerForPaste')
      .querySelector(`input[value="${viewer.Caption}"]`);
    expect(input).toBeInTheDocument();
    fireEvent.input(input, {
      target: {
        value: 'testChange'
      }
    });
    expect(input).toBeInTheDocument();
    screen
      .getByTestId('wrapperNameViewerForPaste')
      .querySelector(`input[value="testChange"]`);
  });
  test('проверка функции переименования viewer', () => {
    const renameViewerMock = jest.fn();
    render(
      <ViewerForPaste
        viewer={viewer}
        changeOrderViewerInEntities={() => null}
        changeSelectedToggleiewer={() => null}
        deleteView={() => null}
        isEven={false}
        renameViewer={renameViewerMock}
      />
    );
    const input = screen
      .getByTestId('wrapperNameViewerForPaste')
      .querySelector(`input[value="${viewer.Caption}"]`);
    expect(input).toBeInTheDocument();
    fireEvent.input(input, {
      target: {
        value: 'testChange'
      }
    });
    expect(renameViewerMock).toBeCalledWith('testChange', viewer.Id);
  });
  test('Проверить выделение селектора', () => {
    const changeSelectedToggleiewerMock = jest.fn();
    render(
      <ViewerForPaste
        viewer={viewer}
        changeOrderViewerInEntities={() => null}
        changeSelectedToggleiewer={changeSelectedToggleiewerMock}
        deleteView={() => null}
        isEven={false}
        renameViewer={() => null}
      />
    );
    const wrapper = screen.getByTestId('listWrapper');
    const checkbox = wrapper.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);
    expect(changeSelectedToggleiewerMock).toBeCalledWith(viewer.Id);
  });
  test('проверить порядковый номер при копирование', () => {
    const changeOrderViewerInEntitiesMock = jest.fn();
    render(
      <ViewerForPaste
        viewer={viewer}
        changeOrderViewerInEntities={changeOrderViewerInEntitiesMock}
        changeSelectedToggleiewer={() => null}
        deleteView={() => null}
        isEven={false}
        renameViewer={() => null}
      />
    );
    const input = screen.getByTestId('inputOrder');
    fireEvent.input(input, {
      target: {
        value: 5
      }
    });
    expect(changeOrderViewerInEntitiesMock).toBeCalledWith(viewer.Id, 5);
  });
  test('проверить удаления вида', () => {
    const deleteViewMock = jest.fn();
    render(
      <ViewerForPaste
        viewer={viewer}
        changeOrderViewerInEntities={() => null}
        changeSelectedToggleiewer={() => null}
        deleteView={deleteViewMock}
        isEven={false}
        renameViewer={() => null}
      />
    );
    const deleteBtn = screen.getByText('Удалить из памяти');
    fireEvent.click(deleteBtn);
    expect(deleteViewMock).toBeCalledWith(viewer.Id);
  });
});
