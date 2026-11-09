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
{title:'Офисы для вашей команды.',description:'Рабочие помещения на четырёх этажах. По проекту: 458 м² офисов на первом этаже, 1 976 м² на втором, 1 850 м² на третьем, 2 000 м² на четвёртом.',image:'slide-14-3.webp',alt:'Проектная планировка первого этажа',caption:'План первого этажа · проект',metric:'4',unit:'этажа с офисами'},
{title:'Гибкое место для работы.',description:'На третьем этаже предусмотрен коворкинг площадью 44 м². Число рабочих мест, оснащение и условия доступа уточняются.',image:'floor-3.webp',alt:'Проектная планировка третьего этажа с зоной коворкинга',caption:'План третьего этажа · проект',metric:'44',unit:'м² по проекту'},
{title:'Пространство для общих событий.',description:'Конгрессно-выставочный зал на первом этаже: 434 м² и 235 мест. Предусмотрена трансформация пространства для разных форматов мероприятий.',image:'hall.webp',alt:'Проектная визуализация конгрессно-выставочного зала',caption:'Визуализация зала',metric:'235',unit:'мест по проекту'},
{title:'Продуманная территория.',description:'В концепции благоустройства предусмотрено около 80 парковочных мест и велопарковка. Фактическое число мест и условия доступа требуют подтверждения.',image:'slide-11-0.webp',alt:'Проектная схема парковки',caption:'Схема парковки · проект',metric:'≈80',unit:'парковочных мест в концепции'}
];
const tabs=$$('[data-space]');
function selectSpace(index,focus=false){const item=spaces[index];tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});if(focus)tabs[index].focus();$('#space-panel').setAttribute('aria-labelledby',tabs[index].id);$('#space-title').textContent=item.title;$('#space-description').textContent=item.description;$('#space-image').src='./assets/'+item.image;$('#space-image').alt=item.alt;$('#space-caption').textContent=item.caption;setMetric(item.metric);$('#space-unit').textContent=item.unit;}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectSpace(i));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectSpace(next,true);}});});
$('.image-expand').addEventListener('click',()=>{const src=$('#space-image');$('#dialog-image').src=src.src;$('#dialog-image').alt=src.alt;$('#dialog-caption').textContent=$('#space-caption').textContent;$('#image-dialog').showModal();});

$$('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
$('.grid-toggle').addEventListener('click',e=>{const show=!document.body.classList.contains('show-grid');document.body.classList.toggle('show-grid',show);e.currentTarget.setAttribute('aria-pressed',String(show));});

/* Официальная форма: ответы и подтверждение отправки обрабатывает Яндекс. */
const contactConfig=window.OMSK_CONTACT;
const host=$('#hosted-contact');
const frame=$('#yandex-inquiry');
try{
 const url=new URL(contactConfig.url);
 if(url.protocol!=='https:'||url.hostname!=='forms.yandex.ru'||url.username||url.password||!/^\/(u|cloud)\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname))throw new Error('Invalid form URL');
 const publicUrl=new URL(url);publicUrl.searchParams.delete('iframe');
 host.querySelector('.hosted-open').href=publicUrl.href;
 url.searchParams.set('iframe','1');
 if(frame.src!==url.href)frame.src=url.href;
 frame.name='ya-form-'+url.pathname.split('/').filter(Boolean).at(-1);
}catch{
 frame.hidden=true;
 host.querySelector('.hosted-message').textContent='Форма временно недоступна. Пожалуйста, попробуйте позже.';
}

/* Появление при прокрутке. Без JS и при reduced-motion всё видно сразу. */
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const revealItems=$$('.section-kicker, .editorial h2, .editorial-copy, .split-heading h2, .split-heading > p, .audiences article, .facts > div, .space-panel, .floor-details, .connection-map, .services article, .progress-grid figure, .project-note, .team-card, .team-note, .inquiry-copy, #hosted-contact');
let revealObserver;
if('IntersectionObserver' in window&&!motion.matches){
 revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}
 }),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
 revealItems.forEach((el,i)=>{
  if(el.getBoundingClientRect().top>innerHeight-24){el.classList.add('reveal-pending');el.style.setProperty('--reveal-delay',((i%3)*55)+'ms');revealObserver.observe(el);}
 });
 document.addEventListener('focusin',e=>{
  const parent=e.target.closest('.reveal-pending');if(parent){parent.classList.remove('reveal-pending');revealObserver.unobserve(parent);}
 });
}
const countFrames=new WeakMap();
const numberFormat=new Intl.NumberFormat('ru-RU');
function finalCount(el){return (el.dataset.countPrefix||'')+numberFormat.format(Number(el.dataset.count));}
function animateCounter(el){
 if(countFrames.has(el))cancelAnimationFrame(countFrames.get(el));
 const target=Number(el.dataset.count);
 if(!Number.isFinite(target))return;
 el.setAttribute('aria-label',finalCount(el));
 if(motion.matches){el.textContent=finalCount(el);return;}
 const start=performance.now(),duration=720;
 el.textContent=(el.dataset.countPrefix||'')+'0';
 function tick(now){
  const progress=Math.min(1,(now-start)/duration);
  const value=Math.round(target*(1-Math.pow(1-progress,3)));
  el.textContent=(el.dataset.countPrefix||'')+numberFormat.format(value);
  if(progress<1)countFrames.set(el,requestAnimationFrame(tick));else{el.textContent=finalCount(el);countFrames.delete(el);}
 }
 countFrames.set(el,requestAnimationFrame(tick));
}
function setMetric(value){
 const el=$('#space-metric');
 el.dataset.count=value.replace(/[^0-9]/g,'');
 el.dataset.countPrefix=value.startsWith('≈')?'≈':'';
 animateCounter(el);
}
let countObserver;
if('IntersectionObserver' in window&&!motion.matches){
 countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){animateCounter(entry.target);countObserver.unobserve(entry.target);}
 }),{threshold:.45});
 $$('[data-count]').forEach(el=>countObserver.observe(el));
}
motion.addEventListener('change',e=>{
 if(e.matches){
  revealObserver?.disconnect();countObserver?.disconnect();
  revealItems.forEach(el=>el.classList.remove('reveal-pending'));
  $$('[data-count]').forEach(el=>{if(countFrames.has(el))cancelAnimationFrame(countFrames.get(el));el.textContent=finalCount(el);});
 }
});
