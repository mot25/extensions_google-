import { DropDown } from '../../componets/DropDown';
import { SwitchWithText } from '../../componets/SwitchWithText';
import { IconService } from '../../services/Icon.service';
import { ManagerVieversService } from '../../services/ManagerVievers.service';
import { MenuLeftNavbar, SwitchRenderListType } from '../../type/components.dto';
import { EntitiesType, ViewerType } from '../../type/entities.dto';
import { IconType } from '../../type/icon.dto';
import { createElementNode, useState } from '../../utils/components';
import styles from './contentModalPaste.scss';

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
const glViewerForPaste = new useState<ViewerType[]>([], () => { })
const glicons = new useState<IconType[]>([], () => {
  insertContent()
})


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
  insertContent()
  glViewerForPaste.update(saveViewersStorage)
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (!newValue) return
    const viewers = JSON.parse(newValue)
    insertContent()
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
    label: 'Вставить в текущий класс',
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
const renderPageTwo = async () => {

  const configPasteEntities = new useState<SwitchRenderListType[]>([
    {
      id: '1',
      text: 'Коппировать в текущий',
      value: true
    },
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
  const settingForPaste = new useState<SwitchRenderListType[]>([
    {
      id: '1',
      text: 'Передавать данные внешнему сервису',
    },
    {
      id: '2',
      text: 'Скрывать в структуре объектов',
    },
    {
      id: '3',
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
    console.log("🚀 ~ file: contentModalPaste.ts:320 ~ urlValue ~ urlValue:", urlValue)
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
      console.dir(e.target?.value);
    }
    inputSettingUrlWrapper.append(inputSettingUrl)
  }
  renderInput()
  wrapperSettinWithView.append(inputSettingUrlWrapper)
  wrapperViewersForPaste.append(wrapperDropDownIcon)
  wrapperViewersForPaste.append(wrapperSettinWithView)
  wrapperPageTwo.appendChild(wrapperViewersForPaste)
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


