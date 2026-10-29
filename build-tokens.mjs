import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const tokens=JSON.parse(fs.readFileSync(path.join(root,'tokens.json'),'utf8'));
const lines=['/* 严格采用用户指定的 17 项颜色角色，不另造色阶。 */',':root {'];
for(const group of ['color','semantic','font','font-size','space','radius','shadow','motion','layer','component']){
  for(const [key,value]of Object.entries(tokens[group]))lines.push(`  --${group}-${key}: ${value};`);
}
lines.push('}');
fs.writeFileSync(path.join(root,'tokens.css'),lines.join('\n'));
console.log('tokens.css 已从 tokens.json 同步。');
