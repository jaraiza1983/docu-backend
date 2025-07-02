const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning project...\n');

const rootDir = path.join(__dirname, '..');

// Files and directories to remove
const itemsToRemove = [
  'node_modules',
  'package-lock.json',
  'dist',
  'coverage',
  'database.sqlite',
  'database.sqlite-journal'
];

itemsToRemove.forEach(item => {
  const itemPath = path.join(rootDir, item);
  try {
    if (fs.existsSync(itemPath)) {
      if (fs.lstatSync(itemPath).isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`✅ Removed directory: ${item}`);
      } else {
        fs.unlinkSync(itemPath);
        console.log(`✅ Removed file: ${item}`);
      }
    } else {
      console.log(`ℹ️  Does not exist: ${item}`);
    }
  } catch (error) {
    console.log(`⚠️  Error removing ${item}: ${error.message}`);
  }
});

console.log('\n🎉 Cleanup completed!');
console.log('\n📋 Next steps:');
console.log('1. npm install');
console.log('2. npm run setup');
console.log('3. npm run start:dev'); 