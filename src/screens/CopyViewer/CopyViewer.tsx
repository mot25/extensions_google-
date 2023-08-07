import JSAlert from 'js-alert';

import styles from './CopyViewer.module.scss';
import React, { MouseEvent, useEffect, useState } from 'react'
import { SimpleButton } from '@/components/simple/SimpleButton';
import { ManagerViewersService } from '@/services/ManagerViewers.service';
import { DeleteProgressType } from '@/type/components.dto';
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

  const [viewersState, setViewersState] = useState<ViewerType[]>()
  const [loadDelete, setLoadDelete] = useState<DeleteProgressType[]>([])

  const entities: EntitiesType = entitiesFromPaste.find((_: EntitiesType) => _.isCurrent)
  const deleteViewer = (viewer: ViewerType, e: MouseEvent) => {

    const alert = new JSAlert(`Вы хотите удалить ${viewer.Caption}`, "Выберите опции для удаления");
    alert.addButton("Удалить в текущем классе").then(async function () {
      await ManagerViewersService.deleteViewer(entities.Id, viewer.Id)
    });

    alert.addButton("Удалить во вложенных классах").then(async () => {
      setLoadDelete(prev => {
        if (!prev.length) {
          return [{
            allEntities: entitiesFromPaste.length,
            delete: 0,
            idDeleting: viewer.Caption
          }]
        }
        if (~prev.findIndex((_: DeleteProgressType) => _.idDeleting === viewer.Id)) {
          return [...prev, {
            allEntities: entitiesFromPaste.length,
            delete: 0,
            idDeleting: viewer.Caption
          }]
        }
        return prev
      })
      entitiesFromPaste.forEach(async entity => {
        const viewerDelete = entity?.Viewers?.find(V => V?.Caption === viewer?.Caption)
        if (viewerDelete?.Id !== undefined) {
          await ManagerViewersService.deleteViewer(entity.Id, viewerDelete?.Id)
            .then(() => {
              setLoadDelete(prev => {
                return prev.map(delViewer => {
                  if (delViewer.idDeleting === viewerDelete.Caption) {
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
    setViewersState(entities?.Viewers || [])
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