import axios from 'axios';

import { EntitiesType } from '@/type/entities.dto';

import {
  entitiesForPasteInsert,
  getData,
  getParamFromUrl,
  getPercent,
  getUrlParameter,
  joinParamArrayApi
} from './utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('getParamFromUrl', () => {
  test('базовый случай', () => {
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
  test('без параметров', () => {
    expect(
      getParamFromUrl('https://pdm-kueg.io.neolant.su/structure/entities')
    ).toEqual({
      'https://pdm-kueg.io.neolant.su/structure/entities': ''
    });
  });
  test('есть знак "?", но параметров нет', () => {
    expect(
      getParamFromUrl('https://pdm-kueg.io.neolant.su/structure/entities?')
    ).toEqual({
      '': ''
    });
  });
  test('пустое значение', () => {
    expect(getParamFromUrl('')).toEqual({});
  });
});

describe('entitiesForPasteInsert', () => {
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

describe('getUrlParameter', () => {
  test('когда нашли параметр из строки', () => {
    expect(
      getUrlParameter(
        'https://pdm-kueg.io.neolant.su/objects?id=77734529-b019-ee11-8db1-e3e987d5ab3c&v=aec03df4-93a3-448e-b534-a1da452fa517:26',
        'id'
      )
    ).toEqual('77734529-b019-ee11-8db1-e3e987d5ab3c');
  });
  test('когда не нашли параметр из строки', () => {
    expect(
      getUrlParameter(
        'https://pdm-kueg.io.neolant.su/objects?id=77734529-b019-ee11-8db1-e3e987d5ab3c&v=aec03df4-93a3-448e-b534-a1da452fa517:26',
        '123'
      )
    ).toEqual('');
  });
  test('когда параметр для поиска равен пустому значению', () => {
    expect(
      getUrlParameter(
        'https://pdm-kueg.io.neolant.su/objects?id=77734529-b019-ee11-8db1-e3e987d5ab3c&v=aec03df4-93a3-448e-b534-a1da452fa517:26',
        ''
      )
    ).toEqual('');
  });
});

describe('joinParamArrayApi', () => {
  test('когда мы передали больше 1 параметра и название параметра для отправки', () => {
    expect(joinParamArrayApi(['1', '2', '3'], 'id')).toEqual('id=1&id=2&id=3');
  });
  test('когда мы передали 1 параметр и название параметра для отправки', () => {
    expect(joinParamArrayApi(['1'], 'id')).toEqual('id=1');
    expect(joinParamArrayApi([], 'id')).toEqual('');
  });
});

describe('getPercent', () => {
  test('входное значение равно 0, при максимальном значении 100', () => {
    expect(getPercent(0, 100)).toEqual(0);
  });
  test('входное значение равно -10, при максимальном значении 123', () => {
    expect(getPercent(-10, 123)).toEqual(-8);
  });
  test('входное значение равно 250, при максимальном значении 100', () => {
    expect(getPercent(250, 100)).toEqual(250);
  });
  test('входное значение равно 250, при максимальном значении -100', () => {
    expect(getPercent(250, -100)).toEqual(-250);
  });
});

// Mock the Axios request
describe('test async ', () => {
  let response: any;
  beforeEach(() => {
    response = {
      data: [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: {
              lat: '-37.3159',
              lng: '81.1496'
            }
          },
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets'
          }
        },
        {
          id: 2,
          name: 'Ervin Howell',
          username: 'Antonette',
          email: 'Shanna@melissa.tv',
          address: {
            street: 'Victor Plains',
            suite: 'Suite 879',
            city: 'Wisokyburgh',
            zipcode: '90566-7771',
            geo: { lat: '-43.9509', lng: '-34.4618' }
          },
          phone: '010-692-6593 x09125',
          website: 'anastasia.net',
          company: {
            name: 'Deckow-Crist',
            catchPhrase: 'Proactive didactic contingency',
            bs: 'synergize scalable supply-chains'
          }
        },
        {
          id: 3,
          name: 'Clementine Bauch',
          username: 'Samantha',
          email: 'Nathan@yesenia.net',
          address: {
            street: 'Douglas Extension',
            suite: 'Suite 847',
            city: 'McKenziehaven',
            zipcode: '59590-4157',
            geo: {
              lat: '-68.6102',
              lng: '-47.0653'
            }
          },
          phone: '1-463-123-4447',
          website: 'ramiro.info',
          company: {
            name: 'Romaguera-Jacobson',
            catchPhrase: 'Face to face bifurcated interface',
            bs: 'e-enable strategic applications'
          }
        }
      ]
    };
    mockedAxios.get.mockReturnValue(response);
  });
  test('test async function with axios', async () => {
    const resp = await getData();
    expect(resp).toEqual([1, 2, 3]);
  });
});
