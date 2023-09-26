import { AttributesService } from '@/shared/apiServices/Attributes.service';

import {
  EntitiesType,
  OrderSendType,
  RequestForPasteViewerType,
  ViewerType
} from '../type';

export const createElementNode = (
  tag: keyof HTMLElementTagNameMap,
  classes?: string[]
) => {
  const node = document.createElement(tag);
  classes?.forEach(classStyleName => {
    node.classList.add(classStyleName);
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
  }).catch(err => {
    {
      addErrorInList(`Ошибка в копирование аттрибутов вида
                  ${dataPaste.Caption} в классе ${entity.Name}`);
      new Error(err);
    }
  });
  if (prevViewer) {
    await AttributesService.deleteAttrForViewer({
      idAttrs: prevViewer.Attributes,
      idEntity: entity.Id,
      idViewer: dataPaste.Id
    }).catch(err => {
      {
        addErrorInList(
          `Ошибка в удалении аттрибутов вида
                  ${dataPaste.Caption} в классе ${entity.Name}`
        );
        new Error(err);
      }
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
  }).catch(err => {
    addErrorInList(`Ошибка в копирование аттрибутов класса
                  ${dataPaste.Caption} в классе ${entity.Name}`);
    throw new Error(err);
  });
};

export const getOrderViewerInEntities = ({
  viewerInEntity,
  viewerForPaste,
  newViewersForPaste
}: OrderSendType): Record<string, number> => {
  const currentOrder: Record<string, { id: string; name: string }>[] =
    viewerInEntity.map(({ Id, Caption }) => ({
      [Id]: {
        id: Id,
        name: Caption
      }
    }));

  viewerForPaste.forEach(viewerForOrder => {
    if (!viewerForOrder.isSelected) return;
    // viewerForOrder вид который мы сейчас будем вставлять
    // viewerForPaste все виды которые мы запомнили
    const currentViewer = newViewersForPaste.find(
      _ => _.Caption === viewerForOrder.Caption
    );

    const prevIndex = currentOrder.findIndex(
      prevValue => prevValue[currentViewer.Id]
    );
    if (~prevIndex) {
      currentOrder.splice(prevIndex, 1);
    }

    currentOrder.splice(viewerForOrder.order - 1, 0, {
      [currentViewer.Id]: {
        id: currentViewer.Id,
        name: currentViewer.Caption
      }
    });
  });

  const sendOrder = currentOrder.reduce(
    (acc: Record<string, number>, orderItem, indexOrder) => {
      const id = Object.values(orderItem)[0].id;
      acc[id] = indexOrder;
      return acc;
    },
    {}
  );
  return sendOrder;
};
