import { RequestForPasteViewerType, ViewerType } from './entities.dto';

export type MenuLeftNavbar = {
    title: React.JSX.Element
    id: number
    label: string
}

export type OptionsType = {
    label: string
    value: string
}

export type SwitchRenderListType = {
    id: string
    text: string
    value?: boolean
    bold?: boolean
}

export type TypePasteViewers = {
    viewerForPaste: ViewerType[]
    configPasteEntities: SwitchRenderListType[],
    valueIdIcon: string
    settingForPaste: Array<SwitchRenderListType & { id: keyof Omit<RequestForPasteViewerType['Settings'], 'Url'> | '3' }>
    urlValue: string
}

export type PageNavigatorType = Record<number, React.JSX.Element>

export type DeleteProgressType = {
    idDeleting: string
    allEntities: number
    delete: number
}
export interface HttpHeader {
    name: string;
    value?: string | undefined;
    binaryValue?: ArrayBuffer | undefined;
}