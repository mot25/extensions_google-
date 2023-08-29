/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
import { DropDown } from '@/components/simple/DropDown';
// eslint-disable-next-line max-len
import { InputWithUnderLineColor } from '@/components/simple/InputWithUnderLineColor';
import { SimpleButton } from '@/components/simple/SimpleButton';
import { Switch } from '@/components/simple/Switch';
import { SwitchWithText } from '@/components/simple/SwitchWithText';
import { WrapperNeumorphism } from '@/components/simple/WrapperNeumorphism';
import {
  APPLY_SETTINGS,
  COPY_ATTR_IN_ENTITIES,
  COPY_ATTR_IN_VIEWER,
  COPY_VIEWER_NESTED,
  HIDE_EMPTY_FIELD,
  HIDE_IN_MODEL,
  HIDE_IN_TREE,
  ID_SELECT_ICON,
  ONLY_READ,
  REPLACE_ICON,
  SET_ICON,
  TRANSFER_DATA_EXTERNAL_SERVICES,
  URL_VIEWER_SETTING
} from '@/contentScripts/AppModalPaste/constantAppModalPaste';
import {
  SettingsViewerForPasteType,
  SwitchRenderListType,
  TypePasteViewers
} from '@/type/components.dto';
import {
  EntitiesType,
  RequestForPasteViewerType,
  ViewerType
} from '@/type/entities.dto';
import { IconType } from '@/type/icon.dto';
import JSAlert from 'js-alert';
import React, { useEffect, useRef, useState } from 'react';

import styles from './PasteViewer.module.scss';
import { ViewerForPaste } from '@/components/complex/ViewerForPaste';
import { Progress } from '@/components/simple/Progress';
import { EntitiesService } from '@/services/Entities.service';
import { AttributesService } from '@/services/Attributes.service';
import { getPercent } from '@/shared/utils/utils';

type Props = {
  viewerForPaste: ViewerType[];
  changeSelectedToggleiewer: (id: string) => void;
  deleteView: (id: string) => void;
  changeOrderViewerInEntities: (id: string, order: number) => void;
  icons: IconType[];
  setViewerForPaste: (newViewer: ViewerType[]) => void;
  entitiesFromPaste: EntitiesType[];
};
const initialStateConfigPaste: SwitchRenderListType[] = [
  {
    id: COPY_VIEWER_NESTED,
    text: 'Копировать во все вложенные'
  },
  {
    id: SET_ICON,
    text: 'Установить иконку'
  },
  {
    id: REPLACE_ICON,
    text: 'Заменить иконку'
  },
  {
    id: COPY_ATTR_IN_VIEWER,
    text: 'Копировать атрибуты в вид',
    isActive: true
  },
  {
    id: COPY_ATTR_IN_ENTITIES,
    text: 'Копировать атрибуты в класс'
  },
  {
    id: ID_SELECT_ICON,
    value: ''
  }
];
const initialStateSettingViewer: SettingsViewerForPasteType = [
  {
    id: APPLY_SETTINGS,
    text: 'Применить настройки',
    bold: true
  },
  {
    id: TRANSFER_DATA_EXTERNAL_SERVICES,
    text: 'Передавать данные внешнему сервису'
  },
  {
    id: HIDE_IN_TREE,
    text: 'Скрывать в структуре объектов'
  },
  {
    id: HIDE_IN_MODEL,
    text: 'Скрывать в модели'
  },
  {
    id: ONLY_READ,
    text: 'Только для чтения'
  },
  {
    id: HIDE_EMPTY_FIELD,
    text: 'Скрывать пустые поля'
  },
  {
    id: URL_VIEWER_SETTING,
    value: 'https://'
  }
];

const PasteViewer = ({
  viewerForPaste,
  changeSelectedToggleiewer,
  deleteView,
  changeOrderViewerInEntities,
  icons: icons,
  setViewerForPaste,
  entitiesFromPaste
}: Props) => {
  const allCreatedViewer = useRef<number>(0);
  const [errorCopy, setErrorCopy] = useState<string[]>([]);
  const [countCreate, setCreateCount] = useState(0);
  const [configPaste, setConfigPaste] = useState<SwitchRenderListType[]>(
    initialStateConfigPaste
  );
  const isApplyNestedEntities = configPaste.find(
    _ => _.id === COPY_VIEWER_NESTED
  ).isActive;
  const [settingViewer, setSettingViewer] =
    useState<SettingsViewerForPasteType>(initialStateSettingViewer);

  const configPasteIcon = configPaste.find(_ => _.id === ID_SELECT_ICON);
  const titleIconSelect = icons.find(icon => icon.Id === configPasteIcon.value)
    ?.Name;

  const changeSettingForPaste = (id: string, value: boolean | string) => {
    setSettingViewer(
      prev =>
        prev?.map(_ => {
          if (_.id === id) {
            if (typeof value === 'string') _.value = value;
            if (typeof value === 'boolean') _.isActive = value;
          }
          return _;
        })
    );
  };

  const changeConfigPaste = (id: string, value: boolean | string) => {
    setConfigPaste(
      configPaste?.map(_ => {
        if (_.id === id) {
          if (typeof value === 'string') _.value = value;
          if (typeof value === 'boolean') _.isActive = value;
        }
        return _;
      })
    );
  };

  const pasteViewerInEntities = ({
    viewerForPaste,
    configPasteEntities,
    settingForPaste
  }: TypePasteViewers) => {
    const isApplySettingsCustom = settingForPaste.find(
      _ => _.id === APPLY_SETTINGS
    ).isActive;
    const isApplyIconCustom = configPasteEntities.find(
      _ => _.id === SET_ICON
    ).isActive;
    const isApplyReWriteIconWithEdit = configPasteEntities.find(
      _ => _.id === REPLACE_ICON
    ).isActive;
    const configApplyNewUrl = settingForPaste.find(
      _ => _.id === URL_VIEWER_SETTING
    );
    const isCopyAttrInViewer = configPasteEntities.find(
      _ => _.id === COPY_ATTR_IN_VIEWER
    ).isActive;
    const isCopyAttrInEntity = configPasteEntities.find(
      _ => _.id === COPY_ATTR_IN_ENTITIES
    ).isActive;
    const initialCustomSettings: RequestForPasteViewerType['Settings'] = {
      hideInStructureOfObject: false,
      hideInViewingModel: false,
      SendParams: false,
      hideEmptyFields: false,
      viewMode: 0,
      Url: ''
    };

    // изменяем настройки исходя из выбранных на экране копирования
    settingForPaste.forEach(setting => {
      if (setting.id === '3') return;
      if (setting.id === 'viewMode')
        return (initialCustomSettings[setting.id] = Number(
          !!setting?.isActive
        ));
      if (setting.id === URL_VIEWER_SETTING)
        return (initialCustomSettings[setting.id] = setting.value);
      initialCustomSettings[setting.id] = !!setting?.isActive;
    });

    const selectIcon = configPasteEntities.find(_ => _.id === ID_SELECT_ICON);
    allCreatedViewer.current = entitiesFromPaste.length;
    entitiesFromPaste.forEach(async entity => {
      if (!entity.isCurrent) if (!isApplyNestedEntities) return;
      const promisesListResponseCreateViewers: Promise<ViewerType>[] = [];

      viewerForPaste.forEach(viewer => {
        if (!viewer.isSelected) return;

        initialCustomSettings.Url = configApplyNewUrl?.isActive
          ? configApplyNewUrl?.value
          : viewer?.Settings?.Url;

        const settingForPost = isApplySettingsCustom
          ? { ...viewer.Settings, ...initialCustomSettings }
          : viewer.Settings;

        const IconForPaste: string =
          isApplyIconCustom && selectIcon.value
            ? selectIcon.value
            : viewer.Icon;

        const dataPost: RequestForPasteViewerType = {
          Caption: viewer.Caption,
          Icon: IconForPaste,
          Attributes: viewer.Attributes,
          Name: viewer.Name,
          Settings: settingForPost
        };

        const isHaveViewer = entity.Viewers.find(
          _ => _.Caption === viewer.Caption
        );

        const newViewer = (async () => {
          if (isHaveViewer) {
            const dataCreate = {
              ...dataPost,
              Icon:
                isApplyReWriteIconWithEdit && IconForPaste
                  ? IconForPaste
                  : isHaveViewer.Icon,
              Id: isHaveViewer.Id
            };
            await EntitiesService.changeViewerInEntities(
              entity.Id,
              dataCreate
            ).catch(() => {
              setErrorCopy(prev => [
                ...prev,
                `Ошибка в изменении вида ${dataCreate.Caption} в классе ${entity.Name}`
              ]);
            });
            if (isCopyAttrInViewer) {
              await AttributesService.setAttrViewer({
                idAttrs: dataCreate.Attributes,
                idEntity: entity.Id,
                idViewer: dataCreate.Id
              }).catch(() => {
                setErrorCopy(prev => [
                  ...prev,
                  `Ошибка в копирование аттрибутов вида ${dataCreate.Caption} в классе ${entity.Name}`
                ]);
              });
              await AttributesService.deleteAttrForViewer({
                idAttrs: isHaveViewer.Attributes,
                idEntity: entity.Id,
                idViewer: dataCreate.Id
              }).catch(() => {
                setErrorCopy(prev => [
                  ...prev,
                  `Ошибка в удалении аттрибутов вида ${dataPost.Caption} в классе ${entity.Name}`
                ]);
              });
            }
            if (isCopyAttrInEntity) {
              await AttributesService.setAttrForEntity({
                idAttrs: dataCreate.Attributes,
                idEntity: entity.Id
              }).catch(() => {
                setErrorCopy(prev => [
                  ...prev,
                  `Ошибка в копирование аттрибутов класса ${dataCreate.Caption} в классе ${entity.Name}`
                ]);
              });
            }
            // eslint-disable-next-line no-console
            console.log(
              `Изменили вид: ${dataCreate.Caption} в классе ${entity.Name}`
            );
            return dataCreate;
          } else {
            const response = await EntitiesService.pasteViewerInEntities(
              entity.Id,
              dataPost
            ).catch(() => {
              setErrorCopy(prev => [
                ...prev,
                `Ошибка в создании вида ${dataPost.Caption} в классе ${entity.Name}`
              ]);
            });
            if (isCopyAttrInViewer) {
              await AttributesService.setAttrViewer({
                idAttrs: dataPost.Attributes,
                idEntity: entity.Id,
                idViewer: response.Id
              }).catch(() => {
                setErrorCopy(prev => [
                  ...prev,
                  `Ошибка в копирование аттрибутов вида ${dataPost.Caption} в классе ${entity.Name}`
                ]);
              });
            }
            if (isCopyAttrInEntity) {
              await AttributesService.setAttrForEntity({
                idAttrs: dataPost.Attributes,
                idEntity: entity.Id
              }).catch(() => {
                setErrorCopy(prev => [
                  ...prev,
                  `Ошибка в копирование аттрибутов класса ${dataPost.Caption} в классе ${entity.Name}`
                ]);
              });
            }
            // eslint-disable-next-line no-console
            console.log(
              `Создали вид: ${dataPost.Caption} в классе ${entity.Name}`
            );
            return {
              ...dataPost,
              Id: response.Id
            };
          }
        })();
        promisesListResponseCreateViewers.push(newViewer);
      });
      await Promise.all(promisesListResponseCreateViewers).then(async e => {
        const currentOrder = [...entity.Viewers];

        viewerForPaste.forEach(viewer => {
          if (!viewer.isSelected) return;
          const newViewer = e.find(item => item.Caption === viewer.Caption);
          const order: number =
            viewerForPaste.find(_ => _.Caption === newViewer.Caption)?.order ||
            1;
          currentOrder.splice(order - 1, 0, newViewer);
        });
        const orderHash: Record<string, number> = {};
        currentOrder.forEach((_, ind) => (orderHash[_.Id] = ind));
        setCreateCount(prev => prev + 1);
        await EntitiesService.changeOrderPosition(entity.Id, orderHash);
      });
    });
  };
  const renameViewer = (name: string, idViewer: string) => {
    const newViewers = viewerForPaste.map(viewer => {
      if (viewer.Id === idViewer) viewer.Caption = name;
      return viewer;
    });
    setViewerForPaste(newViewers);
  };
  const completedPaste = (): number => {
    const alert = new JSAlert(
      'Страница будет перезагружена',
      'Новые виды были вставлены'
    );
    alert.addButton('Перезагрузить страницу').then(() => {
      window.location.reload();
    });
    alert.show();
    return window.setTimeout(() => {
      setCreateCount(0);
    }, 3000);
  };
  useEffect(() => {
    let timer: number | undefined = undefined;
    if (getPercent(countCreate, allCreatedViewer.current) === 100) {
      timer = completedPaste();
    }

    return () => clearTimeout(timer);
  }, [countCreate]);

  return (
    <div className={styles.wrapperPageTwo}>
      <div className={styles.wrapperViewersForPaste}>
        <h4 style={{ fontWeight: 'bold' }}>Выберите вид для копирования</h4>
        <ul className={styles.viewer_types}>
          {viewerForPaste.map((el, indexViewer) => {
            return (
              <ViewerForPaste
                key={el.Id}
                viewer={el}
                isEven={indexViewer % 2 === 0}
                changeOrderViewerInEntities={changeOrderViewerInEntities}
                changeSelectedToggleiewer={changeSelectedToggleiewer}
                deleteView={deleteView}
                renameViewer={renameViewer}
              />
            );
          })}
        </ul>
        {errorCopy.length ? (
          <WrapperNeumorphism>
            <div className={styles.wrapperError}>
              <h2>Ошибки</h2>
              {errorCopy.map(textError => {
                return (
                  <div className={styles.wrapperTextError}>
                    <span>{textError}</span>
                  </div>
                );
              })}
            </div>
          </WrapperNeumorphism>
        ) : (
          <>
            <WrapperNeumorphism>
              <div className={styles.wrapperListConfig}>
                {configPaste.map(paramPaste => {
                  if (paramPaste.id === ID_SELECT_ICON) {
                    return (
                      <div className={styles.wrapperDropDownIcon}>
                        <DropDown
                          onChange={idIcon =>
                            changeConfigPaste(paramPaste.id, idIcon)
                          }
                          title="Выберите иконку"
                          list={icons.map(icon => ({
                            label: icon.Name,
                            value: icon.Id
                          }))}
                        />
                        <div className={styles.wrapperSelectTitleIcon}>
                          {titleIconSelect ? (
                            <>
                              <span>Вы выбрали иконку:</span> {titleIconSelect}
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={paramPaste.id}
                      className={styles.rowSwitch}
                    >
                      <SwitchWithText
                        onChange={check => {
                          changeConfigPaste(paramPaste.id, check);
                        }}
                        text={paramPaste.text}
                        value={paramPaste.isActive}
                      />
                    </div>
                  );
                })}
              </div>
            </WrapperNeumorphism>
            <WrapperNeumorphism>
              <div className={styles.wrapperSettingWithView}>
                <div className={styles.rowSwitchSetting}>
                  {settingViewer.map(paramViewer => {
                    if (paramViewer.id === URL_VIEWER_SETTING) {
                      return (
                        <div
                          key={paramViewer.id}
                          className={styles.inputSettingUrlWrapper}
                        >
                          <Switch
                            isRounded
                            onChange={check =>
                              changeSettingForPaste(paramViewer.id, check)
                            }
                            value={paramViewer.isActive}
                          />
                          <InputWithUnderLineColor
                            placeholder="URL контента"
                            value={paramViewer.value}
                            size="s"
                            addStyle={{
                              width: '100%'
                            }}
                            onChange={value =>
                              changeSettingForPaste(paramViewer.id, value)
                            }
                          />
                        </div>
                      );
                    }
                    return (
                      <SwitchWithText
                        key={paramViewer.id}
                        onChange={check =>
                          changeSettingForPaste(paramViewer.id, check)
                        }
                        text={paramViewer.text}
                        bold={paramViewer.bold}
                        value={paramViewer.isActive}
                      />
                    );
                  })}
                </div>
              </div>
            </WrapperNeumorphism>
          </>
        )}
      </div>
      {!countCreate ? (
        <SimpleButton
          wd="150px"
          addStyle={{
            height: '30px'
          }}
          disabled={!~viewerForPaste.findIndex(_ => _.isSelected)}
          addClassName={styles.reload}
          onClick={() =>
            pasteViewerInEntities({
              viewerForPaste,
              configPasteEntities: configPaste,
              settingForPaste: settingViewer
            })
          }
          text="Применить"
        />
      ) : (
        <div className={styles.wrapperProgress}>
          <Progress
            done={
              !isApplyNestedEntities
                ? 100
                : getPercent(countCreate, allCreatedViewer.current)
            }
          />
        </div>
      )}
    </div>
  );
};

export default PasteViewer;
