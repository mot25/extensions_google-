export type EntitiesType = {
    Parent: Parent;
    Level: number;
    Icon: string;
    Attributes: Attributes;
    Viewers: Viewer[];
    Id: string;
    Name: string;
    
    isCurrent?: boolean;
}

export type Viewer = {
    Caption: string;
    Icon: string;
    Attributes: string[];
    Id: string;
    Name: string;
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