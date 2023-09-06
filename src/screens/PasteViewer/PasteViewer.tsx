/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
import JSAlert from 'js-alert';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import ErrorNeumorphism from '@/components/complex/ErrorNeumorphism/ErrorNeumorphism';
import { ViewerForPaste } from '@/components/complex/ViewerForPaste';
import { DropDown } from '@/components/simple/DropDown';
import { InputWithUnderLineColor } from '@/components/simple/InputWithUnderLineColor';
import { Progress } from '@/components/simple/Progress';
import { SimpleButton } from '@/components/simple/SimpleButton';
import { Switch } from '@/components/simple/Switch';
import { SwitchWithText } from '@/components/simple/SwitchWithText';
import { WrapperNeumorphism } from '@/components/simple/WrapperNeumorphism';
import {
  APPLY_SETTINGS,
  COPY_ATTR_IN_ENTITIES,
  COPY_ATTR_IN_VIEWER,
  COPY_VIEWER_NESTED,
  ID_SELECT_ICON,
  REPLACE_ICON,
  SET_ICON,
  URL_VIEWER_SETTING
} from '@/contentScripts/AppModalPaste/constantAppModalPaste';
import { EntitiesService } from '@/services/Entities.service';
import { copyAttrInViewer, copyInEntity } from '@/shared/utils/components';
import { getPercent } from '@/shared/utils/utils';
import { entitiesAllSelector } from '@/store/slice/entitiesSlice';
import {
  SettingsViewerForPasteType,
  SwitchRenderListType,
  TypePasteViewers
} from '@/type/components.dto';
import { RequestForPasteViewerType, ViewerType } from '@/type/entities.dto';
import { IconType } from '@/type/icon.dto';

import styles from './PasteViewer.module.scss';
import {
  CustomSettingsInitialState,
  initialStateConfigPaste,
  initialStateSettingViewer
} from './PasteViewerContanstant';

type Props = {
  viewerForPaste: ViewerType[];
  changeSelectedToggleiewer: (id: string) => void;
  deleteView: (id: string) => void;
  changeOrderViewerInEntities: (id: string, order: number) => void;
  icons: IconType[];
  setViewerForPaste: (newViewer: ViewerType[]) => void;
};

const PasteViewer = ({
  viewerForPaste,
  changeSelectedToggleiewer,
  deleteView,
  changeOrderViewerInEntities,
  icons: icons,
  setViewerForPaste
}: Props) => {
  const entitiesFromPaste = useSelector(entitiesAllSelector);

  const allCreatedViewer = useRef<number>(0);

  const [errorsCopy, setErrorCopy] = useState<string[]>([]);
  const [countCreate, setCreateCount] = useState(0);
  const [configPaste, setConfigPaste] = useState<SwitchRenderListType[]>(
    initialStateConfigPaste
  );
  const [settingViewer, setSettingViewer] =
    useState<SettingsViewerForPasteType>(initialStateSettingViewer);

  const isApplyNestedEntities = configPaste.find(
    _ => _.id === COPY_VIEWER_NESTED
  ).isActive;

  const configPasteIcon = configPaste.find(_ => _.id === ID_SELECT_ICON);
  const titleIconSelect = icons.find(icon => icon.Id === configPasteIcon.value)
    ?.Name;

  const changeDataForPaste = (
    id: string,
    value: boolean | string,
    mode: 'setting' | 'config'
  ) => {
    if (mode === 'setting') {
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
    } else {
      setConfigPaste(
        configPaste?.map(_ => {
          if (_.id === id) {
            if (typeof value === 'string') _.value = value;
            if (typeof value === 'boolean') _.isActive = value;
          }
          return _;
        })
      );
    }
  };
  const addErrorInList = (text: string) => {
    setErrorCopy(prev => {
      prev.push(text);
      return prev;
    });
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
    const initialCustomSettings = CustomSettingsInitialState;

    // изменяем настройки исходя из выбранных на экране копирования
    settingForPaste.forEach(setting => {
      if (setting.id === '3') return;
      if (setting.id === 'viewMode') {
        return (initialCustomSettings[setting.id] = Number(
          !!setting?.isActive
        ));
      }
      if (setting.id === URL_VIEWER_SETTING) {
        return (initialCustomSettings[setting.id] = setting.value);
      }
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
          const includeAttributesEntity = Object.keys(
            entity.Attributes
          ) as string[];
          if (isHaveViewer) {
            const dataEdit = {
              ...dataPost,
              Icon:
                isApplyReWriteIconWithEdit && IconForPaste
                  ? IconForPaste
                  : isHaveViewer.Icon,
              Id: isHaveViewer.Id
            };
            await EntitiesService.changeViewerInEntities(
              entity.Id,
              dataEdit
            ).catch(err => {
              addErrorInList(`Ошибка в изменении вида 
                ${dataEdit.Caption} в классе ${entity.Name}`);
              throw new Error(err);
            });
            if (isCopyAttrInEntity) {
              await copyInEntity(
                dataEdit,
                entity,
                addErrorInList,
                includeAttributesEntity
              );
            }
            if (isCopyAttrInViewer) {
              await copyAttrInViewer(
                dataEdit,
                entity,
                addErrorInList,
                isHaveViewer
              );
            }
            // eslint-disable-next-line no-console
            console.log(
              `Изменили вид: ${dataEdit.Caption} в классе ${entity.Name}`
            );
            return dataEdit;
          } else {
            const response = await EntitiesService.pasteViewerInEntities(
              entity.Id,
              dataPost
            ).catch(err => {
              addErrorInList(`Ошибка в создании вида
                 ${dataPost.Caption} в классе ${entity.Name}`);
              throw new Error(err);
            });
            if (isCopyAttrInEntity) {
              await copyInEntity(
                { ...dataPost, Id: response.Id },
                entity,
                addErrorInList,
                includeAttributesEntity
              );
            }

            if (isCopyAttrInViewer) {
              await copyAttrInViewer(
                { ...dataPost, Id: response.Id },
                entity,
                addErrorInList
              );
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
      await Promise.all(promisesListResponseCreateViewers).then(
        async newViewersForPaste => {
          console.log('🚀 ~ newViewersForPaste:', newViewersForPaste);
          const currentOrder: Record<string, { id: string; name: string }>[] =
            entity.Viewers.map(({ Id, Caption }) => ({
              [Id]: {
                id: Id,
                name: Caption
              }
            }));
          console.log('entity.Viewers', entity.Viewers);
          console.log(viewerForPaste, 'viewerForPaste');
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
          console.log(sendOrder, 'sendOrder');
          await EntitiesService.changeOrderPosition(entity.Id, sendOrder);
          setCreateCount(prev => prev + 1);
        }
      );
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
        {errorsCopy.length ? (
          <ErrorNeumorphism errorsCopy={errorsCopy} />
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
                            changeDataForPaste(paramPaste.id, idIcon, 'config')
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
                          changeDataForPaste(paramPaste.id, check, 'config');
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
                              changeDataForPaste(
                                paramViewer.id,
                                check,
                                'setting'
                              )
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
                              changeDataForPaste(
                                paramViewer.id,
                                value,
                                'setting'
                              )
                            }
                          />
                        </div>
                      );
                    }
                    return (
                      <SwitchWithText
                        key={paramViewer.id}
                        onChange={check =>
                          changeDataForPaste(paramViewer.id, check, 'setting')
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
