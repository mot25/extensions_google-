const getFielsObjectId = document.querySelectorAll('[placeholder="ObjectId"]')
const getFielsToken = document.querySelectorAll('[placeholder="Token"]')
const getFielsUrl = document.querySelectorAll('[placeholder="Url"]')
const blocks = document.querySelectorAll('span').forEach((_, i) => {
  // @ts-ignore
  if (_.childNodes[0].classList[0] === 'opblock') {
    console.dir(_);
    //  _.click()
  }
})

// @ts-ignore
blocks.forEach(_ => _.click())
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === 'dataForInpur') {
      const data = request.payload
      getFielsObjectId.forEach(_ => {
        // @ts-ignore
        if (!_.value) _.value = data.ObjectId
      })
      getFielsToken.forEach(_ => {
        // @ts-ignore
        if (!_.value) _.value = data.Token
      })
      getFielsUrl.forEach(_ => {
        // @ts-ignore
        if (!_.value) _.value = data.Url
      })
    }
  }
);