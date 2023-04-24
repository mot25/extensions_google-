import { MenuLeftNavbar } from '../../type/components.dto';
import './contentModalPaste.scss';

const documentBody = document.body
console.log(111);
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
    label: '11',
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
modalWrapepr.classList.add('modalWrapper__activeex')

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
leftMenuConfig.forEach(item => {

  const categoryItem = document.createElement('li')
  categoryItem.classList.add('navbar__itemex')

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
  setTimeout(() => {clearBeforeNode()}, 1000)
}
top.innerHTML = '<span>close</span>'

modal.append(top)
modal.append(wrapper)
modalWrapepr.append(modal)
documentBody.append(modalWrapepr)
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("🚀 ~ file: contentModalPaste.ts:5 ~ request:", request)
    if (request.actions === 'isShowModal') {
      if (request.payload) {
        modalWrapepr.classList.add('modalWrapper__activeex')
      } else {
        modalWrapepr.classList.remove('modalWrapper__activeex')
      }
    }
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    // if (request.greeting === "hello")
    //   sendResponse({farewell: "goodbye"});
  }
);
/**
 * <nav class="navbar">
  <ul class="navbar__menu">
    <li class="navbar__item">
      <a href="#" class="navbar__link">1<span>Home</span></a>
    </li>
  </ul>
</nav>
 */