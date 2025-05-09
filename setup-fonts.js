import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建目标目录
const fontDir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
  console.log('创建fonts目录:', fontDir);
}

// 源字体目录 (从node_modules查找)
const sourceDir = path.join(__dirname, 'node_modules', '@coderline', 'alphatab', 'dist', 'font');

if (!fs.existsSync(sourceDir)) {
  console.error('找不到AlphaTab字体目录:', sourceDir);
  process.exit(1);
}

// 字体文件列表
const fontFiles = ['Bravura.otf', 'Bravura.woff'];

// 复制文件
fontFiles.forEach(file => {
  const sourceFile = path.join(sourceDir, file);
  const destFile = path.join(fontDir, file);
  
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
    console.log(`已复制 ${file} 到 ${fontDir}`);
  } else {
    console.error(`字体文件不存在: ${sourceFile}`);
  }
});

console.log('字体设置完成!');
