import { AttributesService } from '@/services/Attributes.service';
import {
  EntitiesType,
  RequestForPasteViewerType,
  ViewerType
} from '@/type/entities.dto';

export const createElementNode = (
  tag: keyof HTMLElementTagNameMap,
  classes?: string[]
) => {
  const node = document.createElement(tag);
  classes?.forEach(clas => {
    node.classList.add(clas);
  });
  return node;
};
export class RenderWarningTextInPopup {
  private warningText: string;
  private body = document.body;
  constructor(message: string) {
    this.warningText = message;
  }

  render() {
    const wrapperWarning = createElementNode('div', ['wrapperWarning']);
    const warningText = createElementNode('span', ['warningText']);
    warningText.innerText = this.warningText;
    wrapperWarning.append(warningText);
    this.body.appendChild(wrapperWarning);
    setTimeout(() => {
      wrapperWarning.remove();
    }, 3000);
  }
}

export const copyAttrInViewer = async (
  dataPaste: RequestForPasteViewerType,
  entity: EntitiesType,
  addErrorInList: (text: string) => void,
  prevViewer?: ViewerType
) => {
  await AttributesService.setAttrViewer({
    idAttrs: dataPaste.Attributes,
    idEntity: entity.Id,
    idViewer: dataPaste.Id
  }).catch(() => {
    addErrorInList(`Ошибка в копирование аттрибутов вида 
                  ${dataPaste.Caption} в классе ${entity.Name}`);
  });
  if (prevViewer) {
    await AttributesService.deleteAttrForViewer({
      idAttrs: prevViewer.Attributes,
      idEntity: entity.Id,
      idViewer: dataPaste.Id
    }).catch(() => {
      addErrorInList(
        `Ошибка в удалении аттрибутов вида 
                  ${dataPaste.Caption} в классе ${entity.Name}`
      );
    });
  }
};
export const copyInEntity = async (
  dataPaste: RequestForPasteViewerType,
  entity: EntitiesType,
  addErrorInList: (text: string) => void,
  includeAttributesEntity: string[]
) => {
  const attributesForCopy: string[] = Array.from(
    new Set([...includeAttributesEntity, ...dataPaste.Attributes])
  );

  await AttributesService.setAttrForEntity({
    idAttrs: attributesForCopy,
    idEntity: entity.Id
  }).catch(() =>
    addErrorInList(`Ошибка в копирование аттрибутов класса 
                  ${dataPaste.Caption} в классе ${entity.Name}`)
  );
};
