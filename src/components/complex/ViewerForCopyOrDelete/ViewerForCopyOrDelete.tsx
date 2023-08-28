import React from 'react';
import styles from './ViewerForCopyOrDelete.module.scss';
import { SimpleButton } from '@/components/simple/SimpleButton';
import { ViewerType } from '@/type/entities.dto';
type Props = {
  isHave: boolean;
  viewer: ViewerType;
  deleteViewer: (viewer: ViewerType) => void;
  addStateViewers: (viewer: ViewerType) => void;
};

const ViewerForCopyOrDelete = ({
  isHave,
  viewer,
  addStateViewers,
  deleteViewer
}: Props) => {
  return (
    <li className={styles.item}>
      <span className={styles.name}>{viewer.Caption}</span>
      <SimpleButton
        wd="150px"
        addStyle={{
          height: '24px'
        }}
        bg="#CC3333"
        addClassName={styles.delete_btn}
        onClick={() => deleteViewer(viewer)}
        text="Удалить"
      />
      {/* <div className={styles.progressBar}>
              <Progress done={60} />
            </div> */}
      <SimpleButton
        wd="150px"
        addStyle={{
          height: '24px'
        }}
        bg={isHave ? '#d3d3d3' : '#4CAF50'}
        onClick={() => {
          if (isHave) return;
          addStateViewers(viewer);
        }}
        text="Запомнить вид"
      />
    </li>
  );
};

export default ViewerForCopyOrDelete;
