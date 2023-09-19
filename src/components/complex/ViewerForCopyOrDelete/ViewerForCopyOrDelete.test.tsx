import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { ManagerViewersService } from '@/services/ManagerViewers.service';
import StoreProvider from '@/shared/Provider/StoreProvider';
import { EntitiesType, ViewerType } from '@/type/entities.dto';

import ViewerForCopyOrDelete, {
  deleteInCurrentEntity,
  deleteInNestedEntity
} from './ViewerForCopyOrDelete';

jest.mock('@/services/ManagerViewers.service');
jest.mock('axios');
// const axiosMock = axios as jest.Mocked<typeof axios>
const entity: EntitiesType = {
  Attributes: {},
  Icon: 'Icon1',
  Id: 'Id1',
  Level: 1,
  Name: 'Name1',
  Parent: {
    Id: 'ParentId1'
  },
  Viewers: []
};
const viewer: ViewerType = {
  Attributes: [],
  Caption: 'viewerName',
  Icon: 'Icon',
  Id: 'Id',
  Name: 'Name',
  isSelected: false,
  order: 1
};
let entitiesForPaste: EntitiesType[] = [];
beforeEach(() => {
  entitiesForPaste = [
    {
      Attributes: {},
      Icon: '',
      Id: '',
      Level: 1,
      Name: '',
      Parent: {
        Id: ''
      },
      Viewers: [
        {
          Attributes: [],
          Caption: viewer.Caption,
          Icon: '',
          Id: '',
          Name: ''
        }
      ]
    },
    {
      Attributes: {},
      Icon: '',
      Id: '',
      Level: 1,
      Name: '',
      Parent: {
        Id: ''
      },
      Viewers: [
        {
          Attributes: [],
          Caption: viewer.Caption,
          Icon: '',
          Id: '',
          Name: ''
        }
      ]
    }
  ];
});
describe('ViewerForCopyOrDelete', () => {
  test('отрисовка всей строки с ее данными без действий', () => {
    render(
      <StoreProvider
        initState={{
          entities: {
            entitiesForPaste
          }
        }}
      >
        <ViewerForCopyOrDelete
          isHave={false}
          addStateViewers={() => null}
          entity={entity}
          viewer={viewer}
        />
      </StoreProvider>
    );
    const name = screen.getByTestId('Caption');
    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent('viewerName');
  });
});

describe('Проверка функций которые удаляют классы ', () => {
  afterEach(() => {
    // jest.clearAllMocks()
  });
  test('Проверка удаления только в текущем классе', async () => {
    ManagerViewersService.deleteViewer = jest.fn();
    const cb = jest.fn();
    await deleteInCurrentEntity(entity, viewer, cb);
    expect(cb).toBeCalled();
    expect(ManagerViewersService.deleteViewer).toBeCalled();
    expect(ManagerViewersService.deleteViewer).toBeCalledWith(
      entity.Id,
      viewer.Id
    );
  });
  test('Проверка удаления во вложенных классов', async () => {
    ManagerViewersService.deleteViewer = jest.fn(() => Promise.resolve());
    const cb = jest.fn();
    await deleteInNestedEntity(entitiesForPaste, viewer, cb);
    expect(cb).toBeCalled();
    expect(cb.mock.calls.length).toEqual(entitiesForPaste.length);
  });
  test('Проверка удаления во вложенных классов если один вид не имеет Caption', async () => {
    entitiesForPaste[0].Viewers[0].Caption = undefined;
    ManagerViewersService.deleteViewer = jest.fn(() => Promise.resolve());
    const cb = jest.fn();
    await deleteInNestedEntity(entitiesForPaste, viewer, cb);
    expect(cb).toBeCalled();
    expect(cb.mock.calls.length).toEqual(entitiesForPaste.length - 1);
  });
});

describe('Проверка пропса isHave', () => {
  test('Цвет кнопки, если isHave = false', () => {
    // const cbAddStateViewers = jest.fn()
    render(
      <StoreProvider
        initState={{
          entities: {
            entitiesForPaste
          }
        }}
      >
        <ViewerForCopyOrDelete
          isHave={false}
          addStateViewers={() => null}
          entity={entity}
          viewer={viewer}
        />
      </StoreProvider>
    );
    expect(screen.getByText('Запомнить вид').parentElement).toHaveStyle({
      'background-color': 'rgb(76, 175, 80)'
    });
  });
  test('Цвет кнопки, если isHave = true', () => {
    render(
      <StoreProvider
        initState={{
          entities: {
            entitiesForPaste
          }
        }}
      >
        <ViewerForCopyOrDelete
          isHave={true}
          addStateViewers={() => null}
          entity={entity}
          viewer={viewer}
        />
      </StoreProvider>
    );
    expect(screen.getByText('Запомнить вид').parentElement).toHaveStyle({
      'background-color': 'rgb(211, 211, 211)'
    });
  });
  test('проверка функции addStateViewers когда isHave = false', () => {
    const addStateViewersMock = jest.fn();
    render(
      <StoreProvider
        initState={{
          entities: {
            entitiesForPaste
          }
        }}
      >
        <ViewerForCopyOrDelete
          isHave={false}
          addStateViewers={addStateViewersMock}
          entity={entity}
          viewer={viewer}
        />
      </StoreProvider>
    );

    const btn = screen.getByText('Запомнить вид');
    fireEvent.click(btn);
    expect(addStateViewersMock).toBeCalled();
    expect(addStateViewersMock).toBeCalledWith(viewer);
  });
  test('проверка функции addStateViewers когда isHave = true', () => {
    const addStateViewersMock = jest.fn();
    render(
      <StoreProvider
        initState={{
          entities: {
            entitiesForPaste
          }
        }}
      >
        <ViewerForCopyOrDelete
          isHave={true}
          addStateViewers={addStateViewersMock}
          entity={entity}
          viewer={viewer}
        />
      </StoreProvider>
    );

    const btn = screen.getByText('Запомнить вид');
    userEvent.click(btn);
    expect(addStateViewersMock).not.toBeCalled();
  });
});
