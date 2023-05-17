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
        const el = _ as HTMLInputElement
        if (!el.value) el.value = data.ObjectId
      })
      getFielsToken.forEach(_ => {
        const el = _ as HTMLInputElement
        if (!el.value) el.value = data.Token
      })
      getFielsUrl.forEach(_ => {
        const el = _ as HTMLInputElement
        if (!el.value) el.value = data.Url
      })
    }
  }
);