const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Create .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  const envExampleContent = `PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development`;

  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('✅ Created .env.example file');
}

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!');
  console.log('📝 Please create a .env file with the following content:');
  console.log('');
  console.log('PORT=3000');
  console.log('JWT_SECRET=your-super-secret-jwt-key-change-this-in-production');
  console.log('NODE_ENV=development');
  console.log('');
  console.log('💡 You can copy from .env.example as a starting point.');
} else {
  console.log('✅ .env file found');
}

console.log('');
console.log('🚀 Next steps:');
console.log('1. npm install');
console.log('2. npm run reset-db');
console.log('3. npm run start:dev');
console.log('4. Visit http://localhost:3000/api for documentation'); 