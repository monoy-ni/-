/* Styled select: a real listbox and keyboard behavior, native select retained as form data source. */
(() => {
  'use strict';
  const D=window.DS,E=D.escape,I=D.icon;
  let sequence=0;
  function enhance(root=document){root.querySelectorAll('select').forEach(select=>{
    if(select.dataset.selectReady)return;
    select.dataset.selectReady='true';
    if(!select.id)select.id='ds-select-'+(++sequence);
    const id=select.id,labels=[...document.querySelectorAll('label')].filter(x=>x.htmlFor===id);
    labels.forEach((l,i)=>{if(!l.id)l.id=id+'-label-'+i});
    const wrap=document.createElement('div');wrap.className='custom-select';
    if(select.style.width)wrap.style.width=select.style.width;
    select.before(wrap);wrap.append(select);select.hidden=true;select.tabIndex=-1;
    const trigger=document.createElement('button');trigger.type='button';trigger.className='select-trigger';trigger.id=id+'-trigger';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-controls',id+'-listbox');trigger.setAttribute('aria-expanded','false');
    if(labels.length)trigger.setAttribute('aria-labelledby',labels.map(l=>l.id).join(' '));else trigger.setAttribute('aria-label',select.getAttribute('aria-label')||'选择选项');
    if(select.hasAttribute('aria-describedby'))trigger.setAttribute('aria-describedby',select.getAttribute('aria-describedby'));
    if(select.required)trigger.setAttribute('aria-required','true');
    trigger.disabled=select.disabled;wrap.append(trigger);
    const popup=document.createElement('div');popup.className='select-popover';popup.hidden=true;
    popup.innerHTML=`<div class="select-options" role="listbox" id="${id}-listbox" aria-label="${E(labels.map(l=>l.textContent).join(' ')||'可选项')}"></div>`;
    (select.closest('dialog')||document.body).append(popup);
    const list=popup.firstElementChild;
    let active=select.selectedIndex,open=false,typed='',lastType=0;
    const options=[...select.options];
    function unavailable(i){return options[i].disabled||options[i].parentElement.disabled;}
    function visibleOptions(){return options.map((o,i)=>({o,i})).filter(x=>!x.o.hidden&&!unavailable(x.i));}
    function render(){let group='';list.innerHTML=options.map((o,i)=>{
      const parent=o.parentElement,g=parent.tagName==='OPTGROUP'?parent.label:'';let heading='';
      if(g&&g!==group){heading=`<div class="select-group" role="presentation">${E(g)}</div>`;group=g;}
      return heading+`<div id="${id}-option-${i}" role="option" aria-selected="${i===select.selectedIndex}" aria-disabled="${!!unavailable(i)}" data-option="${i}" class="select-option ${active===i?'is-active':''}" ${o.hidden?'hidden':''}><span>${E(o.textContent)}</span>${I('check')}</div>`;
    }).join('');}
    function sync(){trigger.innerHTML=`<span class="select-value ${select.value===''?'is-placeholder':''}">${E(options[select.selectedIndex]?.textContent||'请选择')}</span>${I('down')}`;trigger.disabled=select.disabled;trigger.setAttribute('aria-invalid',select.getAttribute('aria-invalid')||'false');active=select.selectedIndex;render();}
    function position(){const r=trigger.getBoundingClientRect(),desired=Math.min(280,list.scrollHeight+12),below=innerHeight-r.bottom-12,above=r.top-12;
      const up=below<Math.min(desired,160)&&above>below;const available=Math.max(80,up?above:below);
      popup.style.width=r.width+'px';popup.style.left=Math.max(8,Math.min(r.left,innerWidth-r.width-8))+'px';popup.style.maxHeight=Math.min(280,available)+'px';
      if(up){popup.style.top='auto';popup.style.bottom=(innerHeight-r.top+6)+'px';}else{popup.style.bottom='auto';popup.style.top=(r.bottom+6)+'px';}}
    function highlight(i){active=i;render();trigger.setAttribute('aria-activedescendant',id+'-option-'+i);list.querySelector('[data-option="'+i+'"]')?.scrollIntoView({block:'nearest'});}
    function show(){if(select.disabled||open)return;open=true;popup.hidden=false;trigger.setAttribute('aria-expanded','true');active=Math.max(0,select.selectedIndex);if(unavailable(active))active=visibleOptions()[0]?.i??0;render();position();highlight(active);}
    function close(focus=false){if(!open)return;open=false;popup.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');if(focus)trigger.focus();}
    function choose(i){if(unavailable(i))return;select.selectedIndex=i;select.dispatchEvent(new Event('change',{bubbles:true}));close(true);}
    trigger.addEventListener('click',()=>open?close():show());
    trigger.addEventListener('keydown',e=>{
      if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const existed=open;show();const indices=visibleOptions().map(x=>x.i);let p=indices.indexOf(active);if(e.key==='Home')p=0;else if(e.key==='End')p=indices.length-1;else if(existed)p=Math.max(0,Math.min(indices.length-1,p+(e.key==='ArrowDown'?1:-1)));highlight(indices[p]??indices[0]);}
      else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(open)choose(active);else show();}
      else if(e.key==='Escape'&&open){e.preventDefault();e.stopPropagation();close(true);}
      else if(e.key==='Tab')close();
      else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){if(Date.now()-lastType>800)typed='';lastType=Date.now();typed+=e.key.toLowerCase();const match=visibleOptions().find(({o})=>o.textContent.trim().toLowerCase().startsWith(typed));if(match){show();highlight(match.i);}}
    });
    popup.addEventListener('pointermove',e=>{const o=e.target.closest('[data-option]');if(o&&!unavailable(Number(o.dataset.option)))highlight(Number(o.dataset.option));});
    popup.addEventListener('mousedown',e=>e.preventDefault());
    popup.addEventListener('click',e=>{const o=e.target.closest('[data-option]');if(o)choose(Number(o.dataset.option));});
    document.addEventListener('click',e=>{if(!wrap.contains(e.target)&&!popup.contains(e.target))close();});
    window.addEventListener('resize',()=>{if(open)position()});
    window.addEventListener('scroll',e=>{if(open&&!popup.contains(e.target))position()},{capture:true,passive:true});
    select.addEventListener('change',sync);select.form?.addEventListener('reset',()=>setTimeout(sync,0));select.closest('dialog')?.addEventListener('close',()=>close());
    labels.forEach(l=>l.addEventListener('click',e=>{e.preventDefault();if(!trigger.disabled)trigger.focus()}));
    sync();
  });}
  const prior=D.init;D.init=(root=document)=>{enhance(root);prior(root)};D.enhanceSelect=enhance;
})();
