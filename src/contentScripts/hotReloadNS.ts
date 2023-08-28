import { getUrlParameter } from '../shared/utils/utils';

const iFrames = document.querySelector('iframe.objects-fill-content');
const getDevServerUrl = () => {
  chrome.runtime.sendMessage({
    action: 'getUrlDevServer',
    payload: getUrlParameter(new URL(window.location.href).search, 'id')
  });
};
getDevServerUrl();

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === 'postUrlDevServer') {
    iFrames.setAttribute('src', request.payload);
  }
});
