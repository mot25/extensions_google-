import { AttributesService } from '@/shared/apiServices/Attributes.service';

import { EntitiesType, RequestForPasteViewerType, ViewerType } from '../type';
import { copyAttrInViewer, getOrderViewerInEntities } from './components';

const attrServicesMocked = AttributesService as jest.Mocked<
  typeof AttributesService
>;
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

describe('copyAttr', () => {
  const attrCopyViewer = jest.spyOn(attrServicesMocked, 'setAttrViewer');
  const attrDelete = jest.spyOn(attrServicesMocked, 'deleteAttrForViewer');
  let dataPaste: RequestForPasteViewerType;
  let entity: EntitiesType;
  const addErrorInList = (text: string) => {};
  let prevViewer: ViewerType;
  beforeEach(() => {
    prevViewer = {
      Attributes: [],
      Caption: '',
      Icon: '',
      Id: '',
      Name: ''
    };
  });
  beforeAll(() => {
    dataPaste = {
      Attributes: [],
      Caption: 'caption',
      Icon: 'icon',
      Name: 'name',
      Settings: {
        hideEmptyFields: false,
        hideInStructureOfObject: true,
        hideInViewingModel: true,
        SendParams: true,
        Url: '',
        viewMode: 1
      }
    };
    entity = {
      Attributes: {
        '1': {
          Group: {
            Id: 1,
            Name: ''
          },
          Id: '',
          Name: '',
          Type: 1
        }
      },
      Icon: '',
      Id: '',
      Level: 1,
      Parent: {
        Id: ''
      },
      Viewers: [],
      Name: ''
    };
  });
  test('проверка будет удаляться старые аттрибуты если они уже есть', async () => {
    await copyAttrInViewer(dataPaste, entity, addErrorInList, prevViewer);
    expect(attrDelete).toBeCalledTimes(1);
    expect(attrCopyViewer).toBeCalledTimes(1);
  });
  test('случай если не будет старых аттрибутов ', async () => {
    await copyAttrInViewer(dataPaste, entity, addErrorInList);
    expect(attrDelete).toBeCalledTimes(0);
    expect(attrCopyViewer).toBeCalledTimes(1);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
