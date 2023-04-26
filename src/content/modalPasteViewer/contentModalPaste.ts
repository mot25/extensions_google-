import { SwitchWithText } from '../../componets/SwitchWithText';
import { ManagerVieversService } from '../../services/ManagerVievers.service';
import { MenuLeftNavbar } from '../../type/components.dto';
import { EntitiesType, ViewerType } from '../../type/entities.dto';
import { createElementNode } from '../../utils/components';
import styles from './contentModalPaste.scss';

const documentBody = document.body
const clearBeforeNode = () => {
  const nodes = document.querySelectorAll('.exNeolant')
  nodes.forEach(element => {
    element.remove();
  });
}
clearBeforeNode()

let glEntitiesFromPaste: EntitiesType[] = []
let glCurrentRightPage = '1'
let glViewerForPaste: ViewerType[] = []

chrome.runtime.sendMessage({
  action: 'getEntities'
})
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === 'postEntitiesForPasteInsert') {
      glEntitiesFromPaste = request.payload
      insertContent()
    }
  }
);
chrome.storage.local.get(["viewersState"], function (result) {
  const allView = result.viewersState && JSON.parse(result.viewersState)
  const saveViewersStorage: ViewerType[] = Array.isArray(allView) ? allView : []
  insertContent()
  glViewerForPaste = saveViewersStorage
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (!newValue) return
    const viewers = JSON.parse(newValue)
    insertContent()
    glViewerForPaste = viewers
  }
});


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
      glCurrentRightPage = (i + 1).toString()
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

  const entities: EntitiesType = glEntitiesFromPaste.find((_: EntitiesType) => _.isCurrent)
  if (!entities) return ''
  ulContainer.innerHTML = ''
  ulContainer.append(...entities?.Viewers?.map(el => addItem(el, entities.Id)))
  wrapperPageOne.append(ulContainer)
  return wrapperPageOne

}
const renderPageTwo = async () => {
  const wrapperPageTwo = createElementNode('div', [styles.wrapperPageTwo])
  const wrapperViewersForPaste = createElementNode('div', [styles.wrapperViewersForPaste])
  const wrapperViewersConfigForPaste = createElementNode('div', [styles.wrapperViewersConfigForPaste])
  wrapperRight.append(wrapperPageTwo)
  const renderStateViewer = async () => {
    const ul = createElementNode('ul', [styles.viewer_types])
    glViewerForPaste.forEach(el => {
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
  wrapperViewersForPaste.append(await renderStateViewer())
  let valueSwitch = true

  wrapperViewersForPaste.append(SwitchWithText({
    onChange: (check) => {
    console.log("🚀 ~ file: contentModalPaste.ts:205 ~ renderPageTwo ~ check:", check)
    valueSwitch = check
    },
    text: 'test',
    value: valueSwitch,
    isRounded: true,
  }))




  wrapperPageTwo.appendChild(wrapperViewersForPaste)
  return wrapperPageTwo

}



async function insertContent(pageId?: string) {
  wrapperRight.innerHTML = ''
  wrapperRight.append(await getHtml(pageId || glCurrentRightPage))
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


