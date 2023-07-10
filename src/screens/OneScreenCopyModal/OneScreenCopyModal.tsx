import JSAlert from 'js-alert';

import { ManagerVieversService } from '../../services/ManagerVievers.service';
import { EntitiesType, ViewerType } from '../../type/entities.dto';
// import { createElementNode, useState } from '../../utils/components';
import styles from './OneScreenCopyModal.module.scss';
import React from 'react'
// type Props = {
//     glEntitiesFromPaste: useState<EntitiesType[]>
//     glViewerForPaste: useState<ViewerType[]>
//     addStateViewers: (view: ViewerType) => void
//     ulContainer: HTMLElement
//     wrapperPageOne: HTMLElement
// // }

// const renderPageOne = async ({ glEntitiesFromPaste, glViewerForPaste, addStateViewers, ulContainer, wrapperPageOne }: Props) => {
//   const addItem = (viewer: ViewerType, idEntities: string, index: number) => {

//     const li = createElementNode("li", [styles.item]);

//     const nameNode = createElementNode("span", [styles.name]);
//     nameNode.innerText = viewer.Caption
//     li.append(nameNode)

//     const addButton = createElementNode("button", [styles.delete_btn]);
//     addButton.innerText = 'Удалить'
//     addButton.onclick = (e) => {


//     }
//     li.append(addButton)

//     const deleteButton = createElementNode("button", [styles.add_btn]);
//     deleteButton.innerText = 'Запомнить вид'

//     deleteButton.style.background = isHave ? '#d3d3d3' : '#4CAF50'
//     if (!isHave) {
//       deleteButton.onclick = () => {
//         addStateViewers({
//           ...viewer,
//           order: index + 1
//         })
//       }
//     }
//     li.append(deleteButton)

//     return li;
//   }

//   const entities: EntitiesType = glEntitiesFromPaste.value.find((_: EntitiesType) => _.isCurrent)
//   if (!entities) return ''
//   ulContainer.innerHTML = ''
//   ulContainer.append(...entities?.Viewers?.map((el, i) => addItem(el, entities.Id, i)))
//   wrapperPageOne.append(ulContainer)
//   return wrapperPageOne
// }

// export default renderPageOne



type Props = {
  glEntitiesFromPaste: EntitiesType[]
  glViewerForPaste: ViewerType[]
  addStateViewers: (view: ViewerType) => void

}

const OneScreenCopyModal = ({
  glEntitiesFromPaste,
  glViewerForPaste,
  addStateViewers
}: Props) => {
  const entities: EntitiesType = glEntitiesFromPaste.find((_: EntitiesType) => _.isCurrent)
  const deleteViewer = (viewer: ViewerType) => {
    const alert = new JSAlert(`Вы хотите удалить ${viewer.Caption}`, "Выберите опции для удаления");
    alert.addButton("Удалить в текущем классе").then(function () {
      ManagerVieversService.deleteViewer(entities.Id, viewer.Id)
      // @ts-ignore
      e.target.style.backgroundColor = 'rgb(211, 211, 211)'
    });
    alert.addButton("Удалить во вложенных классах").then(function () {
      glEntitiesFromPaste.forEach(entit => {
        const idViewerDelete = entit?.Viewers?.find(V => V?.Caption === viewer?.Caption)
        idViewerDelete?.Id !== undefined && ManagerVieversService.deleteViewer(entit.Id, idViewerDelete?.Id)

      })
      // @ts-ignore
      e.target.style.backgroundColor = 'rgb(211, 211, 211)'
    });
    alert.show();

  }

  return (
    <ul>
      {entities?.Viewers?.map((viewer, index) => {
        const isHave = !!~glViewerForPaste.findIndex(_ => _?.Caption === viewer?.Caption)
        return <li
          key={index}
          className={styles.item}
        >
          <span
            className={styles.name}
          >
            {viewer.Caption}
          </span>
          <button
            onClick={() => deleteViewer(viewer)}
            className={styles.delete_btn}
          >Удалить</button>
          <button
            style={{
              background: isHave ? '#d3d3d3' : '#4CAF50'
            }}
            onClick={() => {
              console.log('remember viewer')
              if (isHave) return
              addStateViewers({
                ...viewer,
                order: index + 1
              })
            }}
            className={styles.add_btn}
          >
            Запомнить вид
          </button>
        </li>

      })}
    </ul>
  )
}

export default OneScreenCopyModal