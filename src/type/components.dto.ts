import { RequestForPasteViewerType, ViewerType } from './entities.dto';

export type MenuLeftNavbar = {
    title: string
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
    glValueIdIcon: string
    settingForPaste: Array<SwitchRenderListType & { id: keyof Omit<RequestForPasteViewerType['Settings'], 'Url'> | '3' }>
    urlValue: string
}

export type PageNavigatorType = Record<number, React.JSX.Element>
