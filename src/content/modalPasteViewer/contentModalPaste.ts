import { DropDown } from '../../componets/DropDown';
import { SwitchWithText } from '../../componets/SwitchWithText';
import { EntitiesService } from '../../services/Entities.service';
import { IconService } from '../../services/Icon.service';
import { ManagerVieversService } from '../../services/ManagerVievers.service';
import { MenuLeftNavbar, SwitchRenderListType } from '../../type/components.dto';
import { EntitiesType, RequestForPasteViewerType, ViewerType } from '../../type/entities.dto';
import { IconType } from '../../type/icon.dto';
import { createElementNode, useState } from '../../utils/components';
import styles from './contentModalPaste.scss';
import JSAlert from 'js-alert'



const documentBody = document.body
const clearBeforeNode = () => {
  const nodes = document.querySelectorAll('.exNeolant')
  nodes.forEach(element => {
    element.remove();
  });
}
clearBeforeNode()

const glEntitiesFromPaste = new useState<EntitiesType[]>([], () => { })
const glCurrentRightPage = new useState<string>('1', () => { })
const glViewerForPaste = new useState<ViewerType[]>([], () => {
  // console.log("🚀ewerForPaste:", glViewerForPaste.value)
  console.log("🚀 ~ file: contentModalPaste.ts:30 ~ glViewerForPaste ~ glViewerForPaste:", glViewerForPaste.value)
  insertContent()
})
const glicons = new useState<IconType[]>([], () => {
  insertContent()
})
const changeSelectedToggleiewer = (id: string) => {
  glViewerForPaste.update(glViewerForPaste.value.map(item => {
    if (item.Id === id) {
      console.log("🚀 ~ file: contentModalPaste.ts:36 ~ changeSelectedToggleiewer ~ item:", item)
      item.isSelected = !item?.isSelected
    }
    return item
  }))
}

chrome.runtime.sendMessage({
  action: 'getEntities'
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
      insertContent()
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
const wrapperLeft = createElementNode('div', [styles.wrapperLeft])
const navbarUl = createElementNode('ul', [styles.navbar__menu])
const ulContainer = createElementNode('ul', [styles.list])
const wrapperPageOne = createElementNode('div', [styles.wrapperPageOne])
const wrapperRight = createElementNode('div', [styles.wrapperRight])
const top = createElementNode('div', [styles.top])

modalWrapepr.classList.add('exNeolant')
const leftMenuConfig: MenuLeftNavbar[] = [
  {
    id: '1',
    label: 'Виды в текущем классе',
    title: 'C'
  },
  {
    id: '2',
    label: 'Коппировать',
    title: 'P'
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
    categoryItemLink.innerText = item.title
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
top.innerHTML = '<span>close</span>'

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
  const addItem = (viewer: ViewerType, idEntities: string) => {
    if (viewer.Name !== 'VIEWER_EXTERNAL') return

    const li = createElementNode("li", [styles.item]);

    const nameNode = createElementNode("span", [styles.name]);
    nameNode.innerText = viewer.Caption
    li.append(nameNode)

    const addButton = createElementNode("button", [styles.delete_btn]);
    addButton.innerText = 'Удалить'
    addButton.onclick = () => {
      ManagerVieversService.deleteViewer(idEntities, viewer.Id)
    }
    li.append(addButton)

    const deleteButton = createElementNode("button", [styles.add_btn]);
    deleteButton.innerText = 'Добавить'
    deleteButton.onclick = () => {
      addStateViewers(viewer)
    }
    li.append(deleteButton)

    return li;
  }

  const entities: EntitiesType = glEntitiesFromPaste.value.find((_: EntitiesType) => _.isCurrent)
  if (!entities) return ''
  ulContainer.innerHTML = ''
  ulContainer.append(...entities?.Viewers?.map(el => addItem(el, entities.Id)))
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
  const customSettings: Record<keyof Omit<RequestForPasteViewerType['Settings'], 'Url'>, boolean> = {
    hideInStructureOfObject: false,
    hideInViewingModel: false,
    SendParams: false,
  }
  settingForPaste.forEach(setting => {
    customSettings[setting.id] = !!setting?.value
  })
  // @ts-ignore
  customSettings.Url = urlValue
  glEntitiesFromPaste.value.forEach(entity => {
    if (!entity.isCurrent) if (!isApplyNestedEntities) return
    console.log(1);

    glViewerForPaste.forEach(async viewer => {
      if (!viewer.isSelected) return
      console.log(2);

      const settingForPost = (isApplySettingsCustom ? customSettings : viewer.Settings) as RequestForPasteViewerType['Settings']
      const IconForPost: string = ((isApplyIconCustom && glValueIcons) ? glValueIcons : viewer.Icon)
      const dataPost: RequestForPasteViewerType = {
        Caption: viewer.Caption,
        Icon: IconForPost,
        Attributes: viewer.Attributes,
        Name: viewer.Name,
        Settings: settingForPost
      }
      const isHaveViewer = entity.Viewers.find(_ => _.Caption === viewer.Caption)
      if (isHaveViewer) {
        // const response = await EntitiesService.changeViewerInEntities(entity.Id, {
        //   ...dataPost,
        //   Id: isHaveViewer.Id
        // })
        // console.log("🚀 response add change viewer id ", response)
      } else {
        // const response = await EntitiesService.pasteViewerInEntities(entity.Id, dataPost)
        // console.log("🚀 response add new viewer id ", response)
      }
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
      checkPaste.onclick = () => {
        changeSelectedToggleiewer(el.Id)
      }
      li.appendChild(nameP);
      li.append(checkPaste);

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
      title: 'icon select',
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
    // alert.show();
    // window.location.reload()
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


