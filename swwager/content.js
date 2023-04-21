document.body.appendChild(document.createTextNode('Hello 1'))

chrome.runtime.sendMessage('hello sendMessage', response => {
    // console.log(response, 'response msg');
})