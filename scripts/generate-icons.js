import fs from 'fs';
import path from 'path';

const outlineDir = './node_modules/@tabler/icons/icons/outline';
const filledDir = './node_modules/@tabler/icons/icons/filled';
const out = './src/assets/icons/icons.ts';

function loadIcons(dir, suffix = '') {
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.svg'))
    .map(file => {
      const name = file.replace('.svg', '').replace('icon-', '');
      const svgContent = fs.readFileSync(path.join(dir, file), 'utf8');
      return {
        name: name + suffix,
        svg: svgContent
      };
    });
}

const outlineIcons = loadIcons(outlineDir);
const filledIcons = loadIcons(filledDir, '-filled'); // prefix to avoid collisions

let output = `import { svg, type TemplateResult } from 'lit';\n\ntype IconsType = {[key: string]: TemplateResult<2>;};\n\nexport const icons: IconsType = {\n`;

for (const icon of [...outlineIcons, ...filledIcons]) {
  output += `  "${icon.name}": svg\`${icon.svg}\`,\n`;
}

output += `};\n`;

fs.writeFileSync(out, output);
console.log('Generated icons.ts');
