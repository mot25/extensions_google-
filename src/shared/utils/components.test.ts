import { ViewerType } from '@/type/entities.dto';

import { getOrderViewerInEntities } from './components';

describe('orderViewerInEntities', () => {
  const viewerInEntity: ViewerType[] = [
    {
      Attributes: [],
      Caption: 'Caption1',
      Icon: '1icon',
      Id: '11',
      Name: '11'
    },
    {
      Attributes: [],
      Caption: 'Caption2',
      Icon: '1icon',
      Id: '22',
      Name: '22'
    }
  ];
  const viewerForPaste: ViewerType[] = [
    {
      Attributes: [],
      Caption: '3Caption',
      Icon: 'icon3',
      Id: '33',
      order: 2,
      isSelected: true,
      Name: '33'
    },
    {
      Attributes: [],
      Caption: '3Caption',
      Icon: 'icon4',
      Id: '44',
      order: 5,
      Name: '44'
    }
  ];
  const newViewersForPaste: ViewerType[] = [
    {
      Attributes: [],
      Caption: '3Caption',
      Icon: 'icon3',
      Id: '33',
      order: 2,
      isSelected: true,
      Name: '33'
    }
  ];
  test('Правильный вариант', () => {
    expect(
      getOrderViewerInEntities({
        newViewersForPaste,
        viewerForPaste,
        viewerInEntity
      })
    ).toEqual({
      '11': 0,
      '22': 2,
      '33': 1
    });
  });
  test('Нет видов в классе', () => {
    expect(
      getOrderViewerInEntities({
        newViewersForPaste,
        viewerForPaste,
        viewerInEntity: []
      })
    ).toEqual({
      '33': 0
    });
  });
});
