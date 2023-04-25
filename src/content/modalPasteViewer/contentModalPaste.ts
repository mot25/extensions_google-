import { ManagerVieversService } from '../../services/ManagerVievers.service';
import { MenuLeftNavbar } from '../../type/components.dto';
import { EntitiesType, ViewerType } from '../../type/entities.dto';
import './contentModalPaste.scss';

const documentBody = document.body
const clearBeforeNode = () => {
  const nodes = document.querySelectorAll('.exNeolant')
  nodes.forEach(element => {
    element.remove();
  });
}
clearBeforeNode()
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
  },
  {
    id: '3',
    label: '33',
    title: '333'
  },
]
const createElementNode = (tag: keyof HTMLElementTagNameMap, classes?: string[]) => {
  const node = document.createElement(tag)
  classes.forEach(clas => {
    node.classList.add(clas + 'ex')
  });
  return node
}
const modalWrapepr = createElementNode('div', ['modalWrapper', 'modalWrapper__active'])
modalWrapepr.classList.add('exNeolant')

const modal = createElementNode('div', ['modal'])

const wrapper = createElementNode('div', ['wrapperModal'])

const wrapperLeft = createElementNode('div', ['wrapperLeft'])

const navbarUl = createElementNode('ul', ['navbar__menu'])
leftMenuConfig.forEach((item, i) => {

  const categoryItem = createElementNode('li', ['navbar__item'])
  categoryItem.onclick = () => {
    insertContent((i + 1).toString())
  }

  const categoryItemLink = createElementNode('div', ['navbar__link'])
  categoryItemLink.innerText = item.title
  categoryItem.append(categoryItemLink)

  const label = document.createElement('span')
  label.innerText = item.label

  categoryItemLink.append(label)

  navbarUl.append(categoryItem)
})
wrapperLeft.append(navbarUl)


const wrapperRight = createElementNode('div', ['wrapperRight'])

wrapper.append(wrapperLeft)
wrapper.append(wrapperRight)

const top = createElementNode('div', ['top'])
top.onclick = () => {
  modalWrapepr.classList.toggle('modalWrapper__activeex')
  setTimeout(() => { clearBeforeNode() }, 1000)
}
top.innerHTML = '<span>close</span>'

modal.append(top)
modal.append(wrapper)
modalWrapepr.append(modal)
documentBody.append(modalWrapepr)
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // console.log("🚀 ~ file: contentModalPaste.ts:83 ~ request:", request)
    if (request.actions === 'isShowModal') {
      if (request.payload) {
        modalWrapepr.classList.add('modalWrapper__activeex')
      } else {
        modalWrapepr.classList.remove('modalWrapper__activeex')
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


async function insertContent(pageId: string = '1') {
  wrapperRight.innerHTML = ''
  if (pageId === '1') {
    const wrapperPageOne = createElementNode('div', ['wrapperPageOne'])
    const response = await chrome.runtime.sendMessage({
      action: 'getEntities'
    })
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.action === 'postEntitiesForPasteInsert') {
          const viewers: EntitiesType = request.payload.find((_: EntitiesType) => _.isCurrent)
          if (!viewers) return
          const ulContainer = createElementNode('ul', ['list'])
          wrapperRight.append(wrapperPageOne)

          const addItem = (viewer: ViewerType) => {
            const li = createElementNode("li", ['item']);

            const nameNode = createElementNode("span", ['name']);
            nameNode.innerText = viewer.Caption
            li.append(nameNode)

            const addButton = createElementNode("button", ['delete-btn']);
            addButton.innerText = 'Удалить'
            addButton.onclick = () => {
              ManagerVieversService.deleteViewer(viewers.Id, viewer.Id)
            }
            li.append(addButton)

            const deleteButton = createElementNode("button", ['add-btn']);
            deleteButton.innerText = 'Добавить'
            deleteButton.onclick = () => {
              addStateViewers(viewer)
            }
            li.append(deleteButton)

            ulContainer.appendChild(li);
          }
          ulContainer.innerHTML = ''
          viewers?.Viewers?.forEach(el => {
            addItem(el)
          })
          wrapperPageOne.append(ulContainer)
        }
      }
    );
  }
  if (pageId === '2') {
    const wrapperPageTwo = createElementNode('div', ['wrapperPageTwo'])
    wrapperRight.append(wrapperPageTwo)
    const renderStateViewer = (viewers: ViewerType[]) => {
      // создание элементов
      const ul = createElementNode('ul', ['viewer-types'])
      viewers.forEach(el => {
        const li = document.createElement("li");
        const nameP = createElementNode('p', ['name'])
        nameP.textContent = el.Caption;

        li.appendChild(nameP);

        ul.appendChild(li);
      })

      return ul
    }
    chrome.storage.local.get(["viewersState"], function (result) {
      const allView = result.viewersState && JSON.parse(result.viewersState)
      const saveViewersStorage = Array.isArray(allView) ? allView : []
      wrapperPageTwo.innerHTML = ''
      wrapperPageTwo.append(renderStateViewer(saveViewersStorage))
    });
    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (!newValue) return
        const viewers = JSON.parse(newValue)
        wrapperPageTwo.innerHTML = ''
        wrapperPageTwo.append(renderStateViewer(viewers))
      }
    });

  }

}
insertContent()
