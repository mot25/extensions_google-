//#
//# Neosyntez manage view
//# 2023
//#


var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var path = window.location.pathname || '';
var id = urlParams.get('id') || ''
var viewer = urlParams.get('viewer') || ''
var newclass = 'test_view'

function status(response) {
         if (response.status >= 200 && response.status < 300) {
           return Promise.resolve(response)
         } else {
           return Promise.reject(new Error(response.statusText))
         }
}

async function cloneview(id) {

   let url
   let retjson
   let response

   let srcobj
   let srcclass
   let allclasses
   let srcview
   let dstclass
   let dstview
   let parentid
   let attr = []
   let res

   console.log(document.getElementById('classname'))
   //Get current object
   url = './api/structure/entities'
   response = await fetch(url).then(status)
   allclasses = await response.json()

   //Get current object parent
   //url = './api/objects/' + id + '/path'
   //response = await fetch(url).then(status)
   //retjson = await response.json()

   //if (retjson.AncestorsOrSelf.length == 1 ) { parentid = '' }
   //else { parentid = retjson.AncestorsOrSelf[retjson.AncestorsOrSelf.length-2].Id }

   console.log('All class: ', allclasses);
   srcclass = allclasses.find(el => el.Id == id)
   console.log('Source class: ', srcclass);
   srcview = srcclass.Viewers.find(view => view.Id == viewer)
   console.log('Source viewer: ', srcview);
   
   dstclass = allclasses.find(el => el.Name == newclass)
   console.log('Dst class: ', dstclass);
   dstview = dstclass.Viewers.find(view => view.Caption == srcview.Caption)
   console.log('Dst viewer: ', dstview, !dstview);
   
   if (!dstview) {
	   url = './api/structure/entities/' + dstclass.Id + '/viewers'
	   //console.log('url', url)
	   console.log('Add new viewer')
	   response = await fetch(url, {
		   method: 'post',
           headers: {
              "Content-type": "application/json; charset=utf-8"
           },		   
		   body: JSON.stringify(srcview)
	   }).then(status)
	   //console.log('response', response)
       res = await response.json()
	   //console.log('res', res)
   }
   
   //console.log('Parent: ', parentid);

	return 0
   //Create name for new object
   let tm = Math.round(Date.now() / 1000)
   let nm = srcobj.Name + '_' + tm + '_Copy'
   
   //Create new object
   if ( parentid == '' ) { url = './api/objects' }
   else { url = './api/objects?parent=' + parentid }
   
   response = await fetch(url, {
              method: 'post',
              headers: {
                "Content-type": "application/json; charset=utf-8"
              },
              body: '{"Id":"00000000-0000-0000-0000-000000000000","Name":"' + nm + '","Entity":{"Id":"' + srcobj.Entity.Id + '","Name":"forvalidation"}}'
              }).then(status)
   retjson = await response.json()

   //Get new object id as current
   id = retjson.Id
   console.log('New ID: ', id);

   //Enum source object attributes
   for(let key in srcobj.Attributes){

     //Skip attr
     if ( srcobj.Attributes[key].Type ==7 ) { continue }
     if ( srcobj.Attributes[key].Type ==9 ) { continue }
     if ( srcobj.Attributes[key].Type ==10 ) { continue }


     srcobj.Attributes[key].Name = 'forvalidation'   //requried field
     attr.push(srcobj.Attributes[key])               //copy attr from source object
   }

   //if attr exist apply it to new object
   if ( attr.length > 0 ) {
      url = './api/objects/' + id + '/attributes'
      response = await fetch(url, {
                 method: 'put',
                 headers: {
                   "Content-type": "application/json; charset=utf-8"
                 },
                 body: JSON.stringify(attr)
                 }).then(status)
      retjson = await response.json()
   }
   alert("Скопированый объект / New cloned object:\n" + nm + "\n\nОбновите страницу / Refrash page")
   return 1
}

if ( path == '/structure/entities' && id != '' ) { cloneview(id) } else { alert('Выберите класс в дереве / Select source class in tree') }


