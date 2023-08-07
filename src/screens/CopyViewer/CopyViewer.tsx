import JSAlert from 'js-alert';

import styles from './CopyViewer.module.scss';
import React, { MouseEvent, useEffect, useState } from 'react'
import { SimpleButton } from '@/componets/simple/SimpleButton';
import { ManagerVieversService } from '@/services/ManagerVievers.service';
import { DeleteProgresType } from '@/type/components.dto';
import { EntitiesType, ViewerType } from '@/type/entities.dto';


type Props = {
  entitiesFromPaste: EntitiesType[]
  viewerForPaste: ViewerType[]
  addStateViewers: (view: ViewerType) => void

}

const OneScreenCopyModal = ({
  entitiesFromPaste,
  viewerForPaste,
  addStateViewers
}: Props) => {

  const [viwersState, setViwersState] = useState<ViewerType[]>()
  const [loadDelete, setLoadDelete] = useState<DeleteProgresType[]>([])

  const entities: EntitiesType = entitiesFromPaste.find((_: EntitiesType) => _.isCurrent)
  const deleteViewer = (viewer: ViewerType, e: MouseEvent) => {

    const alert = new JSAlert(`Вы хотите удалить ${viewer.Caption}`, "Выберите опции для удаления");
    alert.addButton("Удалить в текущем классе").then(async function () {
      await ManagerVieversService.deleteViewer(entities.Id, viewer.Id)
    });

    alert.addButton("Удалить во вложенных классах").then(async () => {
      setLoadDelete(prev => {
        if (!prev.length) {
          return [{
            allEntites: entitiesFromPaste.length,
            delete: 0,
            idDeleteting: viewer.Caption
          }]
        }
        if (~prev.findIndex((_: DeleteProgresType) => _.idDeleteting === viewer.Id)) {
          return [...prev, {
            allEntites: entitiesFromPaste.length,
            delete: 0,
            idDeleteting: viewer.Caption
          }]
        }
        return prev
      })
      entitiesFromPaste.forEach(async entit => {
        const viewerDelete = entit?.Viewers?.find(V => V?.Caption === viewer?.Caption)
        if (viewerDelete?.Id !== undefined) {
          await ManagerVieversService.deleteViewer(entit.Id, viewerDelete?.Id)
            .then(() => {
              setLoadDelete(prev => {
                return prev.map(delViewer => {
                  if (delViewer.idDeleteting === viewerDelete.Caption) {
                    delViewer.delete = delViewer.delete + 1
                  }
                  return delViewer
                })
              })
            })
        }
      })
    });
    alert.show();
  }

  useEffect(() => {
    setViwersState(entities?.Viewers || [])
  }, [entities])


  return (
    <div>
      <h4 style={{ fontWeight: 'bold' }}>Выберите вид для копирование/удаления</h4>
      <ul className={styles.wrapperItem}>
        {entities?.Viewers?.map((viewer, index) => {
          const isHave = !!~viewerForPaste.findIndex(_ => _?.Caption === viewer?.Caption)
          return <li
            key={viewer.Id}
            className={styles.item}
          >
            <span
              className={styles.name}
            >
              {viewer.Caption}
            </span>
            <SimpleButton
              wd='150px'
              addStyle={{
                height: '24px',
              }}
              bg='#CC3333'
              addClassName={styles.delete_btn}
              onClick={(event) => deleteViewer(viewer, event)}
              text='Удалить'
            />
            {/* <div className={styles.progressBar}>
              <Progress done={60} />
            </div> */}
            <SimpleButton
              wd='150px'
              addStyle={{
                height: '24px',
              }}
              bg={isHave ? '#d3d3d3' : '#4CAF50'}
              onClick={() => {
                if (isHave) return
                addStateViewers({
                  ...viewer,
                  order: index + 1
                })
              }}
              text='Запомнить вид'
            />
          </li>

        })}
      </ul>
    </div>
  )
}

export default OneScreenCopyModal