import classNames from 'classnames';
import React from 'react';

import { InputWithUnderLineColor } from '@/components/simple/InputWithUnderLineColor';
import { SimpleButton } from '@/components/simple/SimpleButton';
import { ViewerType } from '@/type/entities.dto';

import styles from './ViewerForPaste.module.scss';

type Props = {
  viewer: ViewerType;
  isEven: boolean;
  renameViewer: (text: string, id: string) => void;
  changeSelectedToggleiewer: (id: string) => void;
  changeOrderViewerInEntities: (id: string, countPosition: number) => void;
  deleteView: (id: string) => void;
};

const ViewerForPaste = ({
  isEven,
  viewer,
  renameViewer,
  changeOrderViewerInEntities,
  changeSelectedToggleiewer,
  deleteView
}: Props) => {
  return (
    <li
      data-testid="listWrapper"
      className={classNames(styles.viewerWrapper, {
        [styles.viewerWrapper__even]: isEven
      })}
    >
      <div
        title="Название вида для вставки"
        className={styles.name}
        data-testid="wrapperNameViewerForPaste"
      >
        <InputWithUnderLineColor
          onChange={text => renameViewer(text, viewer.Id)}
          value={viewer.Caption}
        />
      </div>
      <span title="Чекбокс для включения вида для вставки">
        <input
          type="checkbox"
          checked={viewer.isSelected}
          onChange={() => changeSelectedToggleiewer(viewer.Id)}
        />
      </span>

      <span title="Порядковый номер вида для вставки">
        <input
          style={{
            width: '30px'
          }}
          data-testid="inputOrder"
          onChange={e =>
            changeOrderViewerInEntities(viewer.Id, +e.target.value)
          }
          value={viewer.order.toString()}
        />
      </span>
      <SimpleButton
        wd="150px"
        addStyle={{
          height: '30px'
        }}
        bg="#CC3333"
        onClick={() => deleteView(viewer.Id)}
        text="Удалить из памяти"
      />
    </li>
  );
};

export default ViewerForPaste;
