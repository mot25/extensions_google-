export type EntitiesType = {
    Parent: Parent;
    Level: number;
    Icon: string;
    Attributes: Attributes;
    Viewers: ViewerType[];
    Id: string;
    Name: string;

    isCurrent?: boolean;
}

export type ViewerType = {
    Caption: string;
    Icon: string;
    Attributes: string[];
    Id: string;
    Name: string;
    Settings: Partial<RequestForPasteViewerType['Settings']>
    isSelected?: boolean;
}

type Attributes = {
    [x: string]: {
        Type: number;
        Group: Group;
        Id: string;
        Name: string;
    };
}


type Group = {
    Id: number;
    Name: string;
}

type Parent = {
    Id: string;
}

export type RequestForPasteViewerType = {
    Id?: string
    Name: string
    Caption: string
    Icon: string
    Attributes: string[];
    Settings: {
        Url: string
        SendParams: boolean
        hideInStructureOfObject: boolean
        hideInViewingModel: boolean
        viewMode: number
        hideEmptyFields: boolean
    }
}