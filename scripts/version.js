#!/usr/bin/env node

/**
 * 自动版本递增脚本
 * 用法：
 *   npm run version:patch  // 0.3.0 -> 0.3.1
 *   npm run version:minor  // 0.3.0 -> 0.4.0
 *   npm run version:major  // 0.3.0 -> 1.0.0
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const [,, type] = process.argv;
const validTypes = ['patch', 'minor', 'major'];

if (!type || !validTypes.includes(type)) {
  console.error(`用法：node scripts/version.js <patch|minor|major>`);
  console.error(`当前版本：${packageJson.version}`);
  process.exit(1);
}

const [major, minor, patch] = packageJson.version.split('.').map(Number);

let newVersion;
switch (type) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`版本已更新：${packageJson.version}`);
console.log('\n提交更改并触发自动发布：');
console.log(`  git add package.json`);
console.log(`  git commit -m "chore: bump version to v${newVersion}"`);
console.log(`  git push`);
