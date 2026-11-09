'use strict';
const $ = (s, scope = document) => scope.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
const menu = $('.menu');
function closeMenu(){ $('.nav').classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Открыть меню'); }
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';$('.nav').classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
$$('.nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
window.matchMedia('(min-width:851px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
$$('[data-audience]').forEach(a=>a.addEventListener('click',()=>{const radio=$('input[name="audience"][value="'+a.dataset.audience+'"]');if(radio)radio.checked=true;}));
const spaces=[
{title:'Офисы для вашей команды.',description:'Рабочие помещения на четырёх этажах. По проекту: 458 м² офисов на первом этаже, 1 976 м² на втором, 1 850 м² на третьем, 2 000 м² на четвёртом.',image:'slide-14-3.webp',alt:'Проектная планировка первого этажа',caption:'План первого этажа · проект, слайд 14',metric:'4',unit:'этажа с офисами'},
{title:'Гибкое место для работы.',description:'На третьем этаже предусмотрен коворкинг площадью 44 м². Число рабочих мест, оснащение и условия доступа уточняются.',image:'floor-3.webp',alt:'Проектная планировка третьего этажа с зоной коворкинга',caption:'План третьего этажа · проект, слайд 17',metric:'44',unit:'м² по проекту'},
{title:'Пространство для общих событий.',description:'Конгрессно-выставочный зал на первом этаже: 434 м² и 235 мест. В презентации предусмотрена трансформация пространства для разных форматов мероприятий.',image:'hall.webp',alt:'Проектная визуализация конгрессно-выставочного зала',caption:'Визуализация зала · слайд 15',metric:'235',unit:'мест по проекту'},
{title:'Продуманная территория.',description:'В концепции благоустройства предусмотрено около 80 парковочных мест и велопарковка. Фактическое число мест и условия доступа требуют подтверждения.',image:'slide-11-0.webp',alt:'Проектная схема парковки',caption:'Схема парковки · проект, слайды 8 и 11',metric:'≈80',unit:'парковочных мест в концепции'}
];
const tabs=$$('[data-space]');
function selectSpace(index,focus=false){const item=spaces[index];tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});if(focus)tabs[index].focus();$('#space-panel').setAttribute('aria-labelledby',tabs[index].id);$('#space-title').textContent=item.title;$('#space-description').textContent=item.description;$('#space-image').src='./assets/'+item.image;$('#space-image').alt=item.alt;$('#space-caption').textContent=item.caption;$('#space-metric').textContent=item.metric;$('#space-unit').textContent=item.unit;}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectSpace(i));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectSpace(next,true);}});});
$('.image-expand').addEventListener('click',()=>{const src=$('#space-image');$('#dialog-image').src=src.src;$('#dialog-image').alt=src.alt;$('#dialog-caption').textContent=$('#space-caption').textContent;$('#image-dialog').showModal();});
$('.privacy-open').addEventListener('click',()=>$('#privacy-dialog').showModal());
$$('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
$('.grid-toggle').addEventListener('click',e=>{const show=!document.body.classList.contains('show-grid');document.body.classList.toggle('show-grid',show);e.currentTarget.setAttribute('aria-pressed',String(show));});
const form=$('#inquiry-form'), result=$('#form-result'), submit=$('.submit');
let submitting=false;
form.addEventListener('submit',async e=>{e.preventDefault();if(submitting||!form.reportValidity())return;const data=new FormData(form);const payload={audience:data.get('audience'),name:String(data.get('name')||'').trim(),company:String(data.get('company')||'').trim(),email:String(data.get('email')||'').trim(),message:String(data.get('message')||'').trim(),consent:data.get('consent')==='on'};if(!payload.name){result.textContent='Укажите имя.';form.elements.name.focus();return;}submitting=true;submit.disabled=true;result.textContent='Сохраняем заявку…';try{const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(12000)});let reply;try{reply=await response.json();}catch{throw new Error('Для работы формы запустите лендинг через run.ps1.');}if(!response.ok)throw new Error(reply.error||'Не удалось сохранить заявку. Попробуйте ещё раз.');result.textContent='Заявка № '+reply.id+' сохранена локально. Управляющей компании она не отправлена.';form.reset();}catch(error){result.textContent=error.name==='TimeoutError'?'Ответ не получен. Перед повторной отправкой проверьте, сохранилась ли заявка.':(error instanceof TypeError?'Нет соединения с локальным сервером. Запустите run.ps1 и повторите попытку.':error.message);}finally{submitting=false;submit.disabled=false;}});

/* Внешняя форма принимает ответы непосредственно на стороне провайдера. */
const contactConfig=window.OMSK_CONTACT||{mode:'local',url:''};
if(contactConfig.mode!=='local'){
 form.hidden=true;
 const host=$('#hosted-contact');host.hidden=false;
 $('.form-edition').textContent='Заявку получит команда по работе с резидентами через Яндекс Форму.';
 let formUrl;
 try{formUrl=new URL(contactConfig.url);if(contactConfig.mode!=='yandex'||formUrl.protocol!=='https:'||formUrl.hostname!=='forms.yandex.ru'||formUrl.username||formUrl.password||!/^\/(u|cloud)\/[a-zA-Z0-9_-]+\/?$/.test(formUrl.pathname))throw new Error('invalid');}
 catch{host.querySelector('.hosted-message').textContent='Приём заявок скоро откроется. Форма проходит настройку.';$('.form-edition').textContent='Канал связи с командой по работе с резидентами готовится к запуску.';}
 if(formUrl&&formUrl.hostname==='forms.yandex.ru'&&contactConfig.mode==='yandex'&&/^\/(u|cloud)\/[a-zA-Z0-9_-]+\/?$/.test(formUrl.pathname)&&!formUrl.username&&!formUrl.password&&formUrl.protocol==='https:'){
  const open=host.querySelector('a');open.href=formUrl.href;open.hidden=false;
  formUrl.searchParams.set('iframe','1');formUrl.searchParams.set('theme','light');
  const frame=document.createElement('iframe');frame.title='Заявка в технопарк Омск Диджитал';frame.src=formUrl.href;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';host.prepend(frame);
  host.querySelector('.hosted-message').textContent='Форму и подтверждение отправки показывает Яндекс. Если форма не загрузилась, откройте её по ссылке.';
 }
}
