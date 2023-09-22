import { EntitiesType } from '@/shared/type';

import {
  entitiesAllSelector,
  entitiesSliceReducer,
  setEntitiesForPaste
} from './entitiesSlice';

describe('тестируем selector', () => {
  const entitiesForPaste: EntitiesType[] = [
    {
      Attributes: {},
      Icon: '',
      Id: '',
      Level: 1,
      Name: 'nameTest',
      Viewers: [],
      Parent: {
        Id: ''
      }
    }
  ];
  test('', () => {
    expect(
      entitiesAllSelector({
        entities: {
          entitiesForPaste: entitiesForPaste
        },
        viewerForPaste: undefined
      })[0].Name
    ).toEqual('nameTest');
  });
});

describe('тестируем reducer', () => {
  test('тестируем reducer', () => {
    expect(
      entitiesSliceReducer(
        { entitiesForPaste: [] },
        setEntitiesForPaste([
          {
            Attributes: {},
            Icon: '',
            Id: '',
            Level: 1,
            Name: 'nameTest',
            Viewers: [],
            Parent: {
              Id: ''
            }
          }
        ])
      ).entitiesForPaste[0].Name
    ).toEqual('nameTest');
  });
});
