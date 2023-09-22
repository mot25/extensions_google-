export type ViewerType = {
  Caption: string;
  Icon: string;
  Attributes: string[];
  Id: string;
  Name: string;
  Settings?: RequestForPasteViewerType['Settings'];

  isSelected?: boolean;
  order?: number;
};
