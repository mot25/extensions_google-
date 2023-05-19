import * as classNames from 'classnames';
import { DropDown } from '../../componets/DropDown';
import { SwitchWithText } from '../../componets/SwitchWithText';
import { IconService } from '../../services/Icon.service';
import { MenuLeftNavbar, SwitchRenderListType } from '../../type/components.dto';
import { EntitiesType, RequestForPasteViewerType, ViewerType } from '../../type/entities.dto';
import { IconType } from '../../type/icon.dto';
import { createElementNode, useState } from '../../utils/components';
import styles from './contentModalPaste.scss';
import JSAlert from 'js-alert'
import { EntitiesService } from './../../services/Entities.service';
import IconClose from '../../assets/icon/IconClose.svg'
import IconPlus from '../../assets/icon/IconPlus.svg'
import IconPaste from '../../assets/icon/IconPaste.svg'
import { ManagerVieversService } from '../../services/ManagerVievers.service';


const documentBody = document.body
const clearBeforeNode = () => {
  const nodes = document.querySelectorAll('.exNeolant')
  nodes.forEach(element => {
    element.remove();
  });
}
clearBeforeNode()
const deleteView = (id: string) => {
  chrome.storage.local.get(["viewersState"], function (result) {
    const allView = result.viewersState && JSON.parse(result.viewersState)
    const saveViewersStorage = allView.filter((item: any) => item.Id !== id)

    chrome.storage.local.set({
      viewersState: JSON.stringify(saveViewersStorage)
    }, function () {
      console.log("Данные сохранены");
    });
  });
}
const glEntitiesFromPaste = new useState<EntitiesType[]>([], () => {
  insertContent()
  renderShowLoading()
  console.log("🚀 ~ file: contentModalPaste.ts:41 ~ glEntitiesFromPaste ~ glEntitiesFromPaste:", glEntitiesFromPaste.value)
})
const glCurrentRightPage = new useState<string>('1', () => { })
const glViewerForPaste = new useState<ViewerType[]>([], () => {
  insertContent()
})
const glicons = new useState<IconType[]>([], () => {
  insertContent()
})
const changeSelectedToggleiewer = (id: string) => {
  glViewerForPaste.update(glViewerForPaste.value.map(item => {
    if (item.Id === id) {
      item.isSelected = !item?.isSelected
    }
    return item
  }))
}

const changeOrderViewerInEntities = (id: string, order: number) => {
  const newViewers = glViewerForPaste.value.map(item => {
    if (item.Id === id) {
      item.order = order
    }
    return item
  })
  glViewerForPaste.update(newViewers)
}
chrome.runtime.sendMessage({
  action: 'getEntities',
  payload: window.location.origin
})
const fetchIcons = async () => {
  try {
    const response = await IconService.getIcons()
    glicons.update(response)
  } catch (error) {
    console.log("🚀 ~ file: contentModalPaste.ts:30 ~ fetchIcons ~ error:", error)
  }
}
fetchIcons()
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === 'postEntitiesForPasteInsert') {
      glEntitiesFromPaste.update(request.payload)
    }
  }
);
chrome.storage.local.get(["viewersState"], function (result) {
  const allView = result.viewersState && JSON.parse(result.viewersState)
  const saveViewersStorage: ViewerType[] = Array.isArray(allView) ? allView : []
  glViewerForPaste.update(saveViewersStorage)
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (!newValue) return
    const viewers = JSON.parse(newValue)
    glViewerForPaste.update(viewers)
  }
});
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.actions === 'isShowModal') {
      if (request.payload) {
        modalWrapepr.classList.add(styles.modalWrapper__active)
        insertContent()
      } else {
        modalWrapepr.classList.remove(styles.modalWrapper__active)
      }
    }
  }
);

const modalWrapepr = createElementNode('div', [styles.modalWrapper, styles.modalWrapper__active])
const modal = createElementNode('div', [styles.modal])
const wrapper = createElementNode('div', [styles.wrapperModal])

const loadingModal = createElementNode('div')
function renderShowLoading() {
  loadingModal.className = classNames(styles.modalLoading, {
    [styles.modalLoading__show]: !glEntitiesFromPaste?.value?.length
  })
  if (glEntitiesFromPaste?.value?.length) {
    setTimeout(() => {
      loadingModal.remove()
    }, 1000)
  }
  loadingModal.innerHTML = 'Загрузка...'
}
renderShowLoading()
wrapper.append(loadingModal)



const wrapperLeft = createElementNode('div', [styles.wrapperLeft])
const navbarUl = createElementNode('ul', [styles.navbar__menu])
const ulContainer = createElementNode('ul', [styles.list])
const wrapperPageOne = createElementNode('div', [styles.wrapperPageOne])
const wrapperRight = createElementNode('div', [styles.wrapperRight])
const top = createElementNode('img', [styles.top])

modalWrapepr.classList.add('exNeolant')
const leftMenuConfig: MenuLeftNavbar[] = [
  {
    id: '1',
    label: 'Виды в текущем классе',
    title: IconPlus
  },
  {
    id: '2',
    label: 'Коппировать',
    title: IconPaste
  }
]

const renderLeftMenu = () => {
  leftMenuConfig.forEach((item, i) => {

    const categoryItem = createElementNode('li', [styles.navbar__item])
    categoryItem.onclick = () => {
      insertContent((i + 1).toString())
      glCurrentRightPage.update((i + 1).toString())
    }

    const categoryItemLink = createElementNode('div', [styles.navbar__link])
    const categoryItemLink_img = createElementNode('img', [styles.navbar__link_img])
    categoryItemLink_img.setAttribute('src', item.title)

    categoryItemLink.append(categoryItemLink_img)
    categoryItem.append(categoryItemLink)
    const label = document.createElement('span')
    label.innerText = item.label

    categoryItemLink.append(label)

    navbarUl.append(categoryItem)
  })
  wrapperLeft.append(navbarUl)

}
renderLeftMenu()



wrapper.append(wrapperLeft)
wrapper.append(wrapperRight)

top.onclick = () => {
  modalWrapepr.classList.toggle(styles.modalWrapper__active)
  setTimeout(() => { clearBeforeNode() }, 1000)
}
top.setAttribute('src', IconClose)


modal.append(top)
modal.append(wrapper)
modalWrapepr.append(modal)
documentBody.append(modalWrapepr)


const addStateViewers = (view: ViewerType) => {
  chrome.storage.local.get(["viewersState"], function (result) {
    const allView = result.viewersState && JSON.parse(result.viewersState)
    const saveViewersStorage = Array.isArray(allView) ? allView : []
    saveViewersStorage.push(view)
    chrome.storage.local.set({
      viewersState: JSON.stringify(saveViewersStorage)
    }, function () {
      console.log("Данные сохранены");
    });
  });
}

const renderPageOne = async () => {
  const addItem = (viewer: ViewerType, idEntities: string, index: number) => {

    const li = createElementNode("li", [styles.item]);

    const nameNode = createElementNode("span", [styles.name]);
    nameNode.innerText = viewer.Caption
    li.append(nameNode)

    const addButton = createElementNode("button", [styles.delete_btn]);
    addButton.innerText = 'Удалить'
    addButton.onclick = (e) => {
      const alert = new JSAlert(`Вы хотите удалить ${viewer.Caption}`, "Выберите опции для удаления");
      alert.addButton("Удалить в текущем классе").then(function () {
        ManagerVieversService.deleteViewer(idEntities, viewer.Id)
      });
      alert.addButton("Удалить во вложенных классах").then(function () {
        glEntitiesFromPaste.value.forEach(entit => {
          const idViewer = entit.Viewers.find(viewer => viewer.Caption === viewer.Caption).Id
          if (!idViewer) return
          ManagerVieversService.deleteViewer(entit.Id, idViewer)
        })
      });
      alert.show();
      // @ts-ignore
      e.target.style.backgroundColor = 'rgb(211, 211, 211)'
    }
    li.append(addButton)

    const deleteButton = createElementNode("button", [styles.add_btn]);
    deleteButton.innerText = 'Добавить'
    const isHave = !!~glViewerForPaste.value.findIndex(_ => _.Caption === viewer.Caption)

    deleteButton.style.background = isHave ? '#d3d3d3' : '#4CAF50'
    if (!isHave) {
      deleteButton.onclick = () => {
        addStateViewers({
          ...viewer,
          order: index + 1
        })
      }
    }
    li.append(deleteButton)

    return li;
  }

  const entities: EntitiesType = glEntitiesFromPaste.value.find((_: EntitiesType) => _.isCurrent)
  if (!entities) return ''
  ulContainer.innerHTML = ''
  ulContainer.append(...entities?.Viewers?.map((el, i) => addItem(el, entities.Id, i)))
  wrapperPageOne.append(ulContainer)
  return wrapperPageOne
}

const pasteViewers = async ({
  glViewerForPaste,
  configPasteEntities,
  glValueIcons,
  settingForPaste,
  urlValue,
}: {
  glViewerForPaste: ViewerType[]
  configPasteEntities: SwitchRenderListType[],
  glValueIcons: string
  settingForPaste: Array<SwitchRenderListType & { id: keyof Omit<RequestForPasteViewerType['Settings'], 'Url'> }>
  urlValue: string
}) => {

  const isApplySettingsCustom = configPasteEntities.find(_ => _.id === '3').value
  const isApplyIconCustom = configPasteEntities.find(_ => _.id === '4').value
  const isApplyNestedEntities = configPasteEntities.find(_ => _.id === '2').value
  const isApplyReWriteIconWithEdit = configPasteEntities.find(_ => _.id === '5').value
  const customSettings: Record<keyof Omit<RequestForPasteViewerType['Settings'], 'Url'>, boolean | number> = {
    hideInStructureOfObject: false,
    hideInViewingModel: false,
    SendParams: false,
    hideEmptyFields: false,
    viewMode: 0
  }

  settingForPaste.forEach(setting => {
    if (setting.id === 'viewMode') {
      customSettings[setting.id] = Number(setting?.value)
      return
    }
    customSettings[setting.id] = !!setting?.value
  })

  // @ts-ignore
  customSettings.Url = urlValue
  glEntitiesFromPaste.value.forEach(async entity => {
    if (!entity.isCurrent) if (!isApplyNestedEntities) return
    const newViewers: ViewerType[] = []
    const promisesListResponse: Promise<ViewerType>[] = [];

    glViewerForPaste.forEach(async viewer => {
      if (!viewer.isSelected) return

      const settingForPost = (isApplySettingsCustom ? { ...viewer.Settings, ...customSettings } : viewer.Settings) as RequestForPasteViewerType['Settings']
      const IconForPost: string = ((isApplyIconCustom && glValueIcons) ? glValueIcons : viewer.Icon)
      const dataPost: RequestForPasteViewerType = {
        Caption: viewer.Caption,
        Icon: IconForPost,
        Attributes: viewer.Attributes,
        Name: viewer.Name,
        Settings: settingForPost
      }
      const isHaveViewer = entity.Viewers.find(_ => _.Caption === viewer.Caption)

      const newViwer = (async () => {
        if (isHaveViewer) {
          const dataCreate = {
            ...dataPost,
            Icon: (isApplyReWriteIconWithEdit && IconForPost) ? IconForPost : isHaveViewer.Icon,
            Id: isHaveViewer.Id
          }
          const response = await EntitiesService.changeViewerInEntities(entity.Id, dataCreate)
          newViewers.push(dataCreate)
          console.log("🚀 response add change viewer id ", response)
          return dataCreate
        } else {
          const response = await EntitiesService.pasteViewerInEntities(entity.Id, dataPost)
          newViewers.push({
            ...dataPost,
            Id: response.Id
          })
          console.log("🚀 response add new viewer id ", response)
          return {
            ...dataPost,
            Id: response.Id
          }
        }
      })()
      promisesListResponse.push(newViwer)
    })

    Promise.all(promisesListResponse).then(async (e) => {
      const currentOrder = [...entity.Viewers]

      glViewerForPaste.forEach(async viewer => {
        if (!viewer.isSelected) return
        const newViewer = e.find(item => item.Caption === viewer.Caption)
        const order: number = glViewerForPaste.find(_ => _.Caption === newViewer.Caption)?.order || 0
        currentOrder.splice(order - 1, 0, newViewer)
      })
      const orderHash: Record<string, number> = {}
      currentOrder.forEach((_, ind) => orderHash[_.Id] = ind)
      const responseOrdert = await EntitiesService.changeOrderPosition(entity.Id, orderHash)
    })

  })
}
const renderPageTwo = async () => {

  const configPasteEntities = new useState<SwitchRenderListType[]>([
    {
      id: '2',
      text: 'Коппировать во все вложенные',
    },
    {
      id: '3',
      text: 'Применить настройки',
    },
    {
      id: '4',
      text: 'Установить иконку',
    },
    {
      id: '5',
      text: 'Перезатирать существующию икноку при изменение',
    }
  ], () => renderConfigPaste)

  const changeValueConfigPaste = (id: string, value: boolean) => {
    configPasteEntities.update(configPasteEntities.value.map(_ => {
      if (_.id === id) _.value = value;
      return _
    }))
  }


  const wrapperPageTwo = createElementNode('div', [styles.wrapperPageTwo])

  const wrapperViewersForPaste = createElementNode('div', [styles.wrapperViewersForPaste])

  const renderStateViewer = () => {
    const ul = createElementNode('ul', [styles.viewer_types])
    glViewerForPaste.value.forEach(el => {
      const li = document.createElement("li");
      const nameP = createElementNode('p', [styles.name])
      nameP.textContent = el.Caption;

      const checkPaste = document.createElement('input')
      checkPaste.setAttribute('type', 'checkbox')
      if (el.isSelected) {
        checkPaste.setAttribute('checked', 'true')
      } else {
        checkPaste.removeAttribute('checked')
      }
      checkPaste.onclick = () => {
        changeSelectedToggleiewer(el.Id)
      }
      const deleteButton = createElementNode('button', [styles.deleteViewer])
      deleteButton.innerText = 'd'
      deleteButton.onclick = () => {
        deleteView(el.Id)
      }

      const orderInput = createElementNode('input', [styles.orderInput])
      orderInput.setAttribute('type', 'number')
      orderInput.setAttribute('value', el.order.toString())
      orderInput.setAttribute('min', "1")
      orderInput.onchange = (e) => {
        // @ts-ignore
        changeOrderViewerInEntities(el.Id, e.target?.value);
      }



      li.appendChild(nameP);
      li.append(checkPaste);
      li.append(orderInput);
      li.append(deleteButton);

      ul.appendChild(li);
    })
    return ul
  }
  wrapperViewersForPaste.append(renderStateViewer())


  const renderConfigPaste = (): any => {
    const wrapperList = createElementNode('div', [styles.wrapperListConfig])
    wrapperList.innerHTML = ''
    configPasteEntities.value.forEach((switchEl) => {
      const rowSwitch = createElementNode('div', [styles.rowSwitch]);
      const listSwitchs = SwitchWithText({
        onChange: (check) => {
          changeValueConfigPaste(switchEl.id, check);
        },
        text: switchEl.text,
        value: switchEl.value,
        isRounded: true,
      });
      rowSwitch.append(listSwitchs)
      wrapperList.append(rowSwitch)
    })
    wrapperViewersForPaste.append(wrapperList)
  }
  renderConfigPaste()

  const glValueIcons = new useState<string>('', () => {
    renderDropDown()
  })
  const wrapperDropDownIcon = createElementNode('div', [styles.wrapperDropDownIcon])
  function renderDropDown() {
    wrapperDropDownIcon.innerHTML = ''
    wrapperDropDownIcon.append(DropDown({
      title: 'Выберите иконку',
      list: glicons.value.map(icon => ({ label: icon.Name, value: icon.Id })),
      onChange: (idIcon) => glValueIcons.update(idIcon),
    }))
    const wrapperTitleDropDown = createElementNode('div', [styles.wrapperSelectTitleIcon])
    const title = glicons.value.find(ic => ic.Id === glValueIcons.value)?.Name
    wrapperTitleDropDown.innerHTML = title ? `
    <span>Вы выбрали иконку:</span> ${title}
    ` : ''
    wrapperDropDownIcon.append(wrapperTitleDropDown)
  }
  renderDropDown()
  const settingForPaste = new useState<Array<SwitchRenderListType & { id: keyof Omit<RequestForPasteViewerType['Settings'], 'Url'> }>>([
    {
      id: 'SendParams',
      text: 'Передавать данные внешнему сервису',
    },
    {
      id: 'hideInStructureOfObject',
      text: 'Скрывать в структуре объектов',
    },
    {
      id: 'hideInViewingModel',
      text: 'Скрывать в модели',
    },
    {
      id: 'viewMode',
      text: 'Только для чтения',
    },
    {
      id: 'hideEmptyFields',
      text: 'Скрывать пустые поля',
    },
  ], () => renderSettinWithView)
  const changeValueSettingForPaste = (id: string, value: boolean) => {
    settingForPaste.update(settingForPaste.value.map(_ => {
      if (_.id === id) _.value = value;
      return _
    }))
  }
  const wrapperSettinWithView = createElementNode('div', [styles.wrapperSettinWithView])
  function renderSettinWithView() {
    wrapperSettinWithView.innerHTML = ''
    const rowSwitch = createElementNode('div', [styles.rowSwitchSetting]);
    settingForPaste.value.forEach((switchEl) => {
      const listSwitchs = SwitchWithText({
        onChange: (check) => {
          changeValueSettingForPaste(switchEl.id, check);
        },
        text: switchEl.text,
        value: switchEl.value,
        isRounded: true,
      });
      rowSwitch.append(listSwitchs)
    })
    wrapperSettinWithView.append(rowSwitch)
  }
  renderSettinWithView()
  const urlValue = new useState('https://', () => {
    renderInput()
  })
  const inputSettingUrlWrapper = createElementNode('div', [styles.inputSettingUrlWrapper]);
  function renderInput() {
    inputSettingUrlWrapper.innerHTML = ''
    const inputSettingUrl = createElementNode('input', [styles.inputSettingUrl]);
    inputSettingUrl.setAttribute('placeholder', 'URL контента')
    inputSettingUrl.setAttribute('type', 'text')
    inputSettingUrl.setAttribute('value', urlValue.value)
    inputSettingUrl.onchange = (e) => {
      // @ts-ignore
      urlValue.update(e.target?.value);
    }
    inputSettingUrlWrapper.append(inputSettingUrl)
  }
  renderInput()
  wrapperSettinWithView.append(inputSettingUrlWrapper)
  wrapperViewersForPaste.append(wrapperDropDownIcon)
  wrapperViewersForPaste.append(wrapperSettinWithView)
  wrapperPageTwo.appendChild(wrapperViewersForPaste)

  const button = createElementNode('button', [styles.reload])
  button.innerText = 'Коппировать'
  button.onclick = async () => {
    await pasteViewers({
      glViewerForPaste: glViewerForPaste.value,
      configPasteEntities: configPasteEntities.value,
      glValueIcons: glValueIcons.value,
      settingForPaste: settingForPaste.value,
      urlValue: urlValue.value,
    })
    modalWrapepr.classList.remove(styles.modalWrapper__active)
    const alert = new JSAlert("Страница будет перезагружена", "Новые виды были вставлены");
    // alert.addButton("Yes").then(function () {
    //   console.log("Alert button Yes pressed");
    // });
    // alert.addButton("No").then(function () {
    //   console.log("Alert button No pressed");
    // });
    alert.show();
    window.location.reload()
  }
  wrapperPageTwo.append(button)


  return wrapperPageTwo
}



async function insertContent(pageId?: string) {
  wrapperRight.innerHTML = ''
  wrapperRight.append(await getHtml(pageId || glCurrentRightPage.value))
}
const getHtml = async (idPage: string) => {
  if (idPage === '1') {
    const component = await renderPageOne() as unknown as Node
    return component
  }
  if (idPage === '2') {
    return renderPageTwo()
  }
  return ''
}


