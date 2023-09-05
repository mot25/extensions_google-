import { EntitiesType } from '@/type/entities.dto';

import { entitiesForPasteInsert, getParamFromUrl } from './utils';

describe('utils getParamFromUrl', () => {
  test('getParamFromUrl базовый случай', () => {
    expect(
      getParamFromUrl(
        'https://pdm-kueg.io.neolant.su/structure/entities?id=0ab76d5e-701a-ee11-8db1-e3e987d5ab3c&mode=1&viewer=19a9e12d-9724-438f-9e52-5bb3f342b901'
      )
    ).toEqual({
      id: '0ab76d5e-701a-ee11-8db1-e3e987d5ab3c',
      mode: '1',
      viewer: '19a9e12d-9724-438f-9e52-5bb3f342b901'
    });
  });
  test('getParamFromUrl без параметров', () => {
    expect(
      getParamFromUrl('https://pdm-kueg.io.neolant.su/structure/entities')
    ).toEqual({
      'https://pdm-kueg.io.neolant.su/structure/entities': ''
    });
  });
  test('getParamFromUrl есть знак "?, но параметров нет', () => {
    expect(
      getParamFromUrl('https://pdm-kueg.io.neolant.su/structure/entities?')
    ).toEqual({
      '': ''
    });
  });
  test('getParamFromUrl пустое значение', () => {
    expect(getParamFromUrl('')).toEqual({});
  });
});
describe('utils entitiesForPasteInsert', () => {
  // Define some example entities for testing
  const entities: EntitiesType[] = [
    {
      Parent: null,
      Level: 1,
      Icon: 'icon1',
      Attributes: {},
      Viewers: [],
      Id: '1',
      Name: 'Entity 1'
    },
    {
      Parent: { Id: '1' },
      Level: 2,
      Icon: 'icon2',
      Attributes: {},
      Viewers: [],
      Id: '2',
      Name: 'Entity 2'
    },
    {
      Parent: { Id: '1' },
      Level: 2,
      Icon: 'icon3',
      Attributes: {},
      Viewers: [],
      Id: '3',
      Name: 'Entity 3'
    },
    {
      Parent: { Id: '2' },
      Level: 3,
      Icon: 'icon4',
      Attributes: {},
      Viewers: [],
      Id: '4',
      Name: 'Entity 4'
    },
    {
      Parent: null,
      Level: 1,
      Icon: 'icon5',
      Attributes: {},
      Viewers: [],
      Id: '5',
      Name: 'Entity 5'
    }
  ];

  test('все срабатывает как надо', () => {
    expect(entitiesForPasteInsert(entities, '1')).toEqual([
      {
        Parent: null,
        Level: 1,
        Icon: 'icon1',
        Attributes: {},
        Viewers: [],
        Id: '1',
        Name: 'Entity 1',
        isCurrent: true
      },
      {
        Parent: {
          Id: '1'
        },
        Level: 2,
        Icon: 'icon2',
        Attributes: {},
        Viewers: [],
        Id: '2',
        Name: 'Entity 2',
        isCurrent: false
      },
      {
        Parent: {
          Id: '2'
        },
        Level: 3,
        Icon: 'icon4',
        Attributes: {},
        Viewers: [],
        Id: '4',
        Name: 'Entity 4',
        isCurrent: false
      },
      {
        Parent: {
          Id: '1'
        },
        Level: 2,
        Icon: 'icon3',
        Attributes: {},
        Viewers: [],
        Id: '3',
        Name: 'Entity 3',
        isCurrent: false
      }
    ]);
  });
  test('не передали значение id класса', () => {
    expect(entitiesForPasteInsert(entities, '')).toEqual([]);
  });
  test('пустой массив классов', () => {
    expect(entitiesForPasteInsert([], '')).toEqual([]);
  });
});
