import {
  SettingsViewerForPasteType,
  SwitchRenderListType,
  ViewerType
} from '@/shared/type';

export type TypePasteViewers = {
  viewerForPaste: ViewerType[];
  configPasteEntities: SwitchRenderListType[];
  settingForPaste: SettingsViewerForPasteType;
};
