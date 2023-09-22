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
