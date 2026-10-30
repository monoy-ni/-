import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const tokens=JSON.parse(fs.readFileSync(path.join(root,'tokens.json'),'utf8'));
const lines=['/* 从 tokens.json 生成；基础角色依据用户提供的《设计系统基础变量.html》。 */',':root {'];
for(const group of ['color','semantic','font','font-size','space','radius','shadow','motion','layer','component']){
  for(const [key,value]of Object.entries(tokens[group]))lines.push(`  --${group}-${key}: ${value};`);
}
for(const [role,spec]of Object.entries(tokens.typography)){
  lines.push(`  --text-${role}-size: ${spec.size};`);
  lines.push(`  --text-${role}-leading: ${spec.leading};`);
  lines.push(`  --text-${role}-weight: ${spec.weight};`);
  lines.push(`  --text-${role}-font: var(--font-${spec.font});`);
}
lines.push('}');
for(const [role,alias]of Object.entries({hero:'t-hero',title:'t-title',body:'t-body',caption:'t-cap',quote:'t-quote'})){
  lines.push(`.text-${role}, .${alias} { font-family: var(--text-${role}-font); font-size: var(--text-${role}-size); line-height: var(--text-${role}-leading); font-weight: var(--text-${role}-weight); }`);
}
lines.push('.text-caption, .t-cap { color: var(--semantic-muted); }');
fs.writeFileSync(path.join(root,'tokens.css'),lines.join('\n'));
fs.writeFileSync(path.join(root,'tokens.js'),'/* Generated from tokens.json. */\nwindow.DESIGN_TOKENS = '+JSON.stringify(tokens,null,2)+';\n');
console.log('tokens.css 与 tokens.js 已从 tokens.json 同步。');
