import { MenuLeftNavbar } from '../../type/components.dto';
import './contentModalPaste.scss';

const documentBody = document.body
let currentPage = '1'
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
    label: '131',
    title: '111'
  },
  {
    id: '2',
    label: '22',
    title: '222'
  },
  {
    id: '3',
    label: '33',
    title: '333'
  },
]
const modalWrapepr = document.createElement('div')

modalWrapepr.classList.add('modalWrapperex')
modalWrapepr.classList.add('exNeolant')

const modal = document.createElement('div')
modal.classList.add('modalex')

const wrapper = document.createElement('div')
wrapper.classList.add('wrapperModalex')

const wrapperLeft = document.createElement('div')
wrapperLeft.classList.add('wrapperLeftex')

const wrapperLeftNavbar = document.createElement('nav')
wrapperLeftNavbar.classList.add('navbarex')

const navbarUl = document.createElement('ul')
navbarUl.classList.add('navbar__menuex')
leftMenuConfig.forEach((item, i) => {

  const categoryItem = document.createElement('l3i')
  categoryItem.classList.add('navbar__itemex')
  categoryItem.setAttribute('idPage', i.toString())
  i ===  1 && categoryItem.classList.add('navbar__item__activeex')

  const categoryItemLink = document.createElement('div')
  categoryItemLink.classList.add('navbar__linkex')
  categoryItemLink.innerText = item.title
  categoryItem.append(categoryItemLink)

  const label = document.createElement('span')
  label.innerText = item.label

  categoryItemLink.append(label)

  navbarUl.append(categoryItem)
})
wrapperLeft.append(navbarUl)


const wrapperRight = document.createElement('div')
wrapperRight.classList.add('wrapperRightex')

wrapper.append(wrapperLeft)
wrapper.append(wrapperRight)

const top = document.createElement('div')
top.classList.add('topex')
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
    if (request.actions === 'isShowModal') {
      if (request.payload && modalWrapepr.classList.contains('modalWrapper__activeex')) {
        modalWrapepr.classList.add('modalWrapper__activeex')
      } else {
        modalWrapepr.classList.remove('modalWrapper__activeex')
      }
    }
  }
);
