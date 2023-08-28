// eslint-disable-next-line max-len
import { URL_VIEWER_SETTING } from '@/contentScripts/AppModalPaste/constantAppModalPaste';
import { RequestForPasteViewerType, ViewerType } from './entities.dto';
import React from 'react';

export type MenuLeftNavbar = {
  title: React.JSX.Element;
  id: number;
  label: string;
};

export type OptionsType = {
  label: string;
  value: string;
};

export type SwitchRenderListType = {
  id: string;
  text?: string;
  isActive?: boolean;
  bold?: boolean;
  value?: string;
};

export type SettingsViewerForPasteType = Array<
  SwitchRenderListType & {
    id:
      | keyof Omit<RequestForPasteViewerType['Settings'], 'Url'>
      | '3'
      | typeof URL_VIEWER_SETTING;
  }
>;

export type TypePasteViewers = {
  viewerForPaste: ViewerType[];
  configPasteEntities: SwitchRenderListType[];
  settingForPaste: SettingsViewerForPasteType;
};

export type PageNavigatorType = Record<number, React.JSX.Element>;

export type DeleteProgressType = {
  idDeleting: string;
  allEntities: number;
  delete: number;
};
export type HttpHeader = {
  name: string;
  value?: string | undefined;
  binaryValue?: ArrayBuffer | undefined;
};
