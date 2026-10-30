/* Local logic and source-contract checks; browser checks are recorded separately. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const results=[];
function test(name,fn){try{fn();results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}}
for(const name of ['system.js','select.js','docs.js','templates.js','qa-summary.js'])test(name+' 语法',()=>new vm.Script(read(name)));
const context={window:{},document:{readyState:'loading',addEventListener(){}},console,setTimeout,clearTimeout};
vm.createContext(context);vm.runInContext(read('system.js'),context);const D=context.window.DS;
test('跨年：2026-12-31 的下一天',()=>assert.equal(D.moveDate('2026-12-31',1),'2027-01-01'));
test('月初前移：2026-03-01',()=>assert.equal(D.moveDate('2026-03-01',-1),'2026-02-28'));
test('2000 年是闰年',()=>assert.equal(D.monthDays(2000,1).count,29));
test('1900 年不是闰年',()=>assert.equal(D.monthDays(1900,1).count,28));
test('日期偏移包含月边界',()=>assert.equal(D.moveDate('2024-02-28',2),'2024-03-01'));
test('空文件选择被拒绝',()=>assert.ok(D.validateFiles([])));
test('不支持的 SVG 格式被拒绝',()=>assert.match(D.validateFiles([{name:'figure.svg',size:123}]),/格式不支持/));
test('大于 5MB 文件被拒绝',()=>assert.match(D.validateFiles([{name:'reference.pdf',size:5*1024*1024+1}]),/超过/));
test('恰好 5MB PDF 可选择',()=>assert.equal(D.validateFiles([{name:'reference.PDF',size:5*1024*1024}]),''));
test('三个合法文件可选择',()=>assert.equal(D.validateFiles([{name:'a.pdf',size:1},{name:'b.png',size:2},{name:'c.JPG',size:3}]),''));
test('第四个文件被拒绝',()=>assert.match(D.validateFiles(Array.from({length:4},()=>({name:'a.pdf',size:1}))),/最多/));
test('空表单定位四项错误',()=>assert.equal(Object.keys(D.validateForm({})).length,4));
test('空白学习目标被拒绝',()=>assert.ok(D.validateForm({title:'  ',email:'a@b.test',topic:'观察',consent:'on'}).title));
test('不完整邮箱被拒绝',()=>assert.ok(D.validateForm({title:'观察',email:'name@',topic:'观察',consent:'on'}).email));
test('合法表单通过',()=>assert.equal(Object.keys(D.validateForm({title:'观察动作',email:'learner@example.com',topic:'观察',consent:'on'})).length,0));
test('用户输入转义而不作为 HTML 注入',()=>assert.equal(D.escape('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;'));
test('本地保存不可用时返回可处理状态',()=>assert.equal(D.storage.set('demo','value'),false));
const tokens=JSON.parse(read('tokens.json'));
const expected={primary:'#20A0E0','primary-deep':'#0060A0','surface-blue':'#EAF4FB','mist-pink':'#F0D9DC','milk-coffee':'#C9A98C',white:'#FFFFFF',paper:'#FDFCFA','april-gray':'#E0E0E0',muted:'#7A8A9A',ink:'#2A3A4A',success:'#4A8B3B',warning:'#7E5E07','warning-surface':'#F5C542',error:'#C21F26','error-surface':'#F0D9DC',info:'#1879AA',accent:'#E4555B'};
test('用户指定的 17 项原始角色逐值一致',()=>assert.deepEqual(tokens.color,expected));
test('主要动作使用澄海蓝，未偷换为深阶',()=>assert.equal(tokens.semantic.action,'#20A0E0'));
test('基础变量原文的四级文字与金句参数',()=>{
  assert.deepEqual(tokens.typography,{
    hero:{size:'48px',leading:1.2,weight:500,font:'display'},
    title:{size:'24px',leading:1.4,weight:500,font:'display'},
    body:{size:'16px',leading:1.8,weight:400,font:'body'},
    caption:{size:'13px',leading:1.6,weight:400,font:'body'},
    quote:{size:'24px',leading:1.6,weight:400,font:'quote'}
  });
});
test('金句与数字字体均有独立职责',()=>{
  assert.match(tokens.font.quote,/鸿雷小纸条青春体/);
  assert.match(tokens.font.num,/JetBrains Mono/);
  assert.notEqual(tokens.font.quote,tokens.font.display);
});
test('间距档位与参考文件列出的推导刻度一致',()=>assert.deepEqual(Object.values(tokens.space),['0px','4px','8px','12px','16px','24px','32px','48px','64px']));
test('图片、卡片、按钮圆角及两种蓝色阴影符合原值',()=>{
  assert.equal(tokens.radius.image,'12px');assert.equal(tokens.radius.card,'16px');assert.equal(tokens.radius.control,'10px');
  assert.equal(tokens.shadow.soft,'0 4px 16px rgba(32,160,224,.10)');
  assert.equal(tokens.shadow.lift,'0 8px 24px rgba(32,160,224,.14)');
});
for(const name of ['index.html','templates.html','课程内容页.html','开学第一课.html'])test(name+' 使用同一份共享样式且无变量副本',()=>{
  const html=read(name);assert.match(html,/href="tokens\.css\?v=reference-1"/);assert.match(html,/href="system\.css\?v=reference-1"/);
  assert.ok(!html.includes('--font-size-caption:'));assert.ok(!html.includes('--color-primary:'));
});
test('规范样张读取变量而不再保留旧字号表',()=>{
  const docs=read('docs.js');assert.ok(docs.includes('const T=window.DESIGN_TOKENS'));
  assert.ok(!docs.includes('Display / 64'));assert.ok(!docs.includes('H1 / 44'));assert.ok(!docs.includes('Caption / 12'));
});
test('JSON 与 CSS 变量源同步',()=>{const css=read('tokens.css');for(const group of ['color','semantic','font','font-size','space','radius','shadow','motion','layer','component'])for(const [key,value]of Object.entries(tokens[group]))assert.ok(css.includes('--'+group+'-'+key+': '+value+';'),group+'.'+key)});
const colors=new Set(Object.values(expected));
for(const name of ['tokens.css','system.css','docs.js','templates.js','select.js','assets/favicon.svg'])test(name+' 无额外 HEX 色值',()=>{const found=read(name).match(/#[\da-fA-F]{6}\b/g)||[];assert.equal(found.filter(x=>!colors.has(x.toUpperCase())).length,0)});
test('所有页面样式所用变量全部有定义',()=>{const css=['tokens.css','system.css','course-layout.css','opening-layout.css','wardrobe-lesson.css'].map(read).join('\n'),defined=new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(x=>x[1]));const refs=[...css.matchAll(/var\((--[\w-]+)/g)].map(x=>x[1]);assert.deepEqual([...new Set(refs.filter(x=>!defined.has(x)))],[])});
test('35 项组件规格与 19+16 缺口范围',()=>{const calls=[...read('docs.js').matchAll(/^  add\('([^']+)'.*?'(基础|反馈|导航|展示|表单|内容)',(true|false),/gm)];assert.equal(calls.length,35);assert.equal(calls.filter(x=>x[3]==='true').length,16)});
test('三个实际图片存在',()=>['campus.jpg','study.jpg','craft.png'].forEach(n=>assert.ok(fs.statSync(path.join(root,'assets',n)).size>0)));
const output={kind:'逻辑和源文件检查',total:results.length,passed:results.filter(x=>x.pass).length,checks:results};
fs.writeFileSync(path.join(root,'logic-checks.json'),JSON.stringify(output,null,2));
console.log(JSON.stringify(output,null,2));
if(results.some(x=>!x.pass))process.exitCode=1;
