const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Docu Backend...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created successfully');
} else {
  console.log('ℹ️  .env file already exists');
}

// Create migrations directory if it doesn't exist
const migrationsDir = path.join(__dirname, '..', 'src', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  console.log('📁 Creating migrations directory...');
  fs.mkdirSync(migrationsDir, { recursive: true });
  console.log('✅ Migrations directory created');
}

console.log('\n🎉 Setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Configure variables in .env');
console.log('3. Run migrations: npm run migration:run');
console.log('4. Start server: npm run start:dev');
console.log('\n📚 Check README.md for more information'); 