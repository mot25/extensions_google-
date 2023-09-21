import { EntitiesType } from '@/type/entities.dto';

import entitiesSlice, {
  entitiesAllSelector,
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
        }
      })[0].Name
    ).toEqual('nameTest');
  });
});

describe('тестируем reducer', () => {
  test('тестируем reducer', () => {
    expect(
      entitiesSlice(
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
