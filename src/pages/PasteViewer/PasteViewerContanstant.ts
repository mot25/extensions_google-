import {
  APPLY_SETTINGS,
  COPY_ATTR_IN_ENTITIES,
  COPY_ATTR_IN_VIEWER,
  COPY_VIEWER_NESTED,
  HIDE_EMPTY_FIELD,
  HIDE_IN_MODEL,
  HIDE_IN_TREE,
  ID_SELECT_ICON,
  ONLY_READ,
  REPLACE_ICON,
  SET_ICON,
  TRANSFER_DATA_EXTERNAL_SERVICES,
  URL_VIEWER_SETTING
} from '@/app/Content/AppModal/constant';
import {
  SettingsViewerForPasteType,
  SwitchRenderListType
} from '@/type/components.dto';
import { RequestForPasteViewerType } from '@/type/entities.dto';

export const initialStateConfigPaste: SwitchRenderListType[] = [
  {
    id: COPY_VIEWER_NESTED,
    text: 'Копировать во все вложенные'
  },
  {
    id: SET_ICON,
    text: 'Установить иконку'
  },
  {
    id: REPLACE_ICON,
    text: 'Заменить иконку'
  },
  {
    id: COPY_ATTR_IN_VIEWER,
    text: 'Копировать атрибуты в вид',
    isActive: true
  },
  {
    id: COPY_ATTR_IN_ENTITIES,
    text: 'Копировать атрибуты в класс'
  },
  {
    id: ID_SELECT_ICON,
    value: ''
  }
];
export const initialStateSettingViewer: SettingsViewerForPasteType = [
  {
    id: APPLY_SETTINGS,
    text: 'Применить настройки',
    bold: true
  },
  {
    id: TRANSFER_DATA_EXTERNAL_SERVICES,
    text: 'Передавать данные внешнему сервису'
  },
  {
    id: HIDE_IN_TREE,
    text: 'Скрывать в структуре объектов'
  },
  {
    id: HIDE_IN_MODEL,
    text: 'Скрывать в модели'
  },
  {
    id: ONLY_READ,
    text: 'Только для чтения'
  },
  {
    id: HIDE_EMPTY_FIELD,
    text: 'Скрывать пустые поля'
  },
  {
    id: URL_VIEWER_SETTING,
    value: 'https://'
  }
];

export const CustomSettingsInitialState: RequestForPasteViewerType['Settings'] =
  {
    hideInStructureOfObject: false,
    hideInViewingModel: false,
    SendParams: false,
    hideEmptyFields: false,
    viewMode: 0,
    Url: ''
  };
