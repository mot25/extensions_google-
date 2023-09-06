type Group = {
  Id: number;
  Name: string;
};
type Attributes = {
  [x: string]: {
    Type: number;
    Group: Group;
    Id: string;
    Name: string;
  };
};
export type RequestForPasteViewerType = {
  Id?: string;
  Name: string;
  Caption: string;
  Icon: string;
  Attributes: string[];
  Settings: {
    Url: string;
    SendParams: boolean;
    hideInStructureOfObject: boolean;
    hideInViewingModel: boolean;
    viewMode: number;
    hideEmptyFields: boolean;
  };
};
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
type Parent = {
  Id: string;
};

export type EntitiesType = {
  Parent: Parent;
  Level: number;
  Icon: string;
  Attributes: Attributes;
  Viewers: ViewerType[];
  Id: string;
  Name: string;

  isCurrent?: boolean;
};
