import './contentModalPaste.scss';
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting === "hello")
      sendResponse({ farewell: "goodbye" });
  }
);
const documentBody = document.body
console.log(111);
const clearBeforeNode = () => {
  const nodes = document.querySelectorAll('.exNeolant')
  nodes.forEach(element => {
    element.remove();
  });
}
clearBeforeNode()
const modalWrapepr = document.createElement('div')
modalWrapepr.classList.add('modalWrapperEx')
modalWrapepr.classList.add('exNeolant')
const modal = document.createElement('div')
modal.classList.add('modalEx')
modalWrapepr.append(modal)
documentBody.append(modalWrapepr)