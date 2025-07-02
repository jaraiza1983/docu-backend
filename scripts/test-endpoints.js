const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

// Helper function to make HTTP requests
function makeRequest(method, endpoint, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testEndpoints() {
  console.log('🚀 Starting comprehensive API endpoint testing...\n');
  
  let adminToken = null;
  let creatorToken = null;
  let testResults = [];

  try {
    // Test 1: Authentication - Admin Login
    console.log('1. Testing Authentication - Admin Login');
    const adminLoginResponse = await makeRequest('POST', '/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    if (adminLoginResponse.statusCode === 200 && adminLoginResponse.body.access_token) {
      adminToken = adminLoginResponse.body.access_token;
      console.log('✅ Admin login successful');
      testResults.push({ test: 'Admin Login', status: 'PASS', statusCode: adminLoginResponse.statusCode });
    } else {
      console.log('❌ Admin login failed:', adminLoginResponse.statusCode, adminLoginResponse.body);
      testResults.push({ test: 'Admin Login', status: 'FAIL', statusCode: adminLoginResponse.statusCode });
    }

    // Test 2: Authentication - Creator Login
    console.log('\n2. Testing Authentication - Creator Login');
    const creatorLoginResponse = await makeRequest('POST', '/auth/login', {
      email: 'john@example.com',
      password: 'password123'
    });
    
    if (creatorLoginResponse.statusCode === 200 && creatorLoginResponse.body.access_token) {
      creatorToken = creatorLoginResponse.body.access_token;
      console.log('✅ Creator login successful');
      testResults.push({ test: 'Creator Login', status: 'PASS', statusCode: creatorLoginResponse.statusCode });
    } else {
      console.log('❌ Creator login failed:', creatorLoginResponse.statusCode, creatorLoginResponse.body);
      testResults.push({ test: 'Creator Login', status: 'FAIL', statusCode: creatorLoginResponse.statusCode });
    }

    // Test 3: Public Categories
    console.log('\n3. Testing Public Categories');
    const publicCategoriesResponse = await makeRequest('GET', '/categories/public');
    
    if (publicCategoriesResponse.statusCode === 200 && Array.isArray(publicCategoriesResponse.body)) {
      console.log(`✅ Public categories retrieved: ${publicCategoriesResponse.body.length} categories`);
      testResults.push({ test: 'Public Categories', status: 'PASS', statusCode: publicCategoriesResponse.statusCode });
    } else {
      console.log('❌ Public categories failed:', publicCategoriesResponse.statusCode, publicCategoriesResponse.body);
      testResults.push({ test: 'Public Categories', status: 'FAIL', statusCode: publicCategoriesResponse.statusCode });
    }

    // Test 4: Public Subcategories
    console.log('\n4. Testing Public Subcategories');
    const publicSubcategoriesResponse = await makeRequest('GET', '/subcategories/public');
    
    if (publicSubcategoriesResponse.statusCode === 200 && Array.isArray(publicSubcategoriesResponse.body)) {
      console.log(`✅ Public subcategories retrieved: ${publicSubcategoriesResponse.body.length} subcategories`);
      testResults.push({ test: 'Public Subcategories', status: 'PASS', statusCode: publicSubcategoriesResponse.statusCode });
    } else {
      console.log('❌ Public subcategories failed:', publicSubcategoriesResponse.statusCode, publicSubcategoriesResponse.body);
      testResults.push({ test: 'Public Subcategories', status: 'FAIL', statusCode: publicSubcategoriesResponse.statusCode });
    }

    // Test 5: Admin - Get All Categories
    console.log('\n5. Testing Admin - Get All Categories');
    const adminCategoriesResponse = await makeRequest('GET', '/categories', null, adminToken);
    
    if (adminCategoriesResponse.statusCode === 200 && Array.isArray(adminCategoriesResponse.body)) {
      console.log(`✅ Admin categories retrieved: ${adminCategoriesResponse.body.length} categories`);
      testResults.push({ test: 'Admin Categories', status: 'PASS', statusCode: adminCategoriesResponse.statusCode });
    } else {
      console.log('❌ Admin categories failed:', adminCategoriesResponse.statusCode, adminCategoriesResponse.body);
      testResults.push({ test: 'Admin Categories', status: 'FAIL', statusCode: adminCategoriesResponse.statusCode });
    }

    // Test 6: Admin - Get All Users
    console.log('\n6. Testing Admin - Get All Users');
    const adminUsersResponse = await makeRequest('GET', '/users', null, adminToken);
    
    if (adminUsersResponse.statusCode === 200 && Array.isArray(adminUsersResponse.body)) {
      console.log(`✅ Admin users retrieved: ${adminUsersResponse.body.length} users`);
      testResults.push({ test: 'Admin Users', status: 'PASS', statusCode: adminUsersResponse.statusCode });
    } else {
      console.log('❌ Admin users failed:', adminUsersResponse.statusCode, adminUsersResponse.body);
      testResults.push({ test: 'Admin Users', status: 'FAIL', statusCode: adminUsersResponse.statusCode });
    }

    // Test 7: Creator - Get Content (should see all content now)
    console.log('\n7. Testing Creator - Get Content');
    const creatorContentResponse = await makeRequest('GET', '/content', null, creatorToken);
    
    if (creatorContentResponse.statusCode === 200 && Array.isArray(creatorContentResponse.body)) {
      console.log(`✅ Creator content retrieved: ${creatorContentResponse.body.length} content items (all content)`);
      testResults.push({ test: 'Creator Content', status: 'PASS', statusCode: creatorContentResponse.statusCode });
    } else {
      console.log('❌ Creator content failed:', creatorContentResponse.statusCode, creatorContentResponse.body);
      testResults.push({ test: 'Creator Content', status: 'FAIL', statusCode: creatorContentResponse.statusCode });
    }

    // Test 8: Admin - Get All Content
    console.log('\n8. Testing Admin - Get All Content');
    const adminContentResponse = await makeRequest('GET', '/content', null, adminToken);
    
    if (adminContentResponse.statusCode === 200 && Array.isArray(adminContentResponse.body)) {
      console.log(`✅ Admin content retrieved: ${adminContentResponse.body.length} content items`);
      testResults.push({ test: 'Admin Content', status: 'PASS', statusCode: adminContentResponse.statusCode });
    } else {
      console.log('❌ Admin content failed:', adminContentResponse.statusCode, adminContentResponse.body);
      testResults.push({ test: 'Admin Content', status: 'FAIL', statusCode: adminContentResponse.statusCode });
    }

    // Test 9: Projects - Get All Projects
    console.log('\n9. Testing Projects - Get All Projects');
    const projectsResponse = await makeRequest('GET', '/projects', null, adminToken);
    
    if (projectsResponse.statusCode === 200 && Array.isArray(projectsResponse.body)) {
      console.log(`✅ Projects retrieved: ${projectsResponse.body.length} projects`);
      testResults.push({ test: 'Projects', status: 'PASS', statusCode: projectsResponse.statusCode });
    } else {
      console.log('❌ Projects failed:', projectsResponse.statusCode, projectsResponse.body);
      testResults.push({ test: 'Projects', status: 'FAIL', statusCode: projectsResponse.statusCode });
    }

    // Test 10: Project Statuses
    console.log('\n10. Testing Project Statuses');
    const projectStatusesResponse = await makeRequest('GET', '/project-statuses/public');
    
    if (projectStatusesResponse.statusCode === 200 && Array.isArray(projectStatusesResponse.body)) {
      console.log(`✅ Project statuses retrieved: ${projectStatusesResponse.body.length} statuses`);
      testResults.push({ test: 'Project Statuses', status: 'PASS', statusCode: projectStatusesResponse.statusCode });
    } else {
      console.log('❌ Project statuses failed:', projectStatusesResponse.statusCode, projectStatusesResponse.body);
      testResults.push({ test: 'Project Statuses', status: 'FAIL', statusCode: projectStatusesResponse.statusCode });
    }

    // Test 11: Project Areas
    console.log('\n11. Testing Project Areas');
    const projectAreasResponse = await makeRequest('GET', '/project-areas/public');
    
    if (projectAreasResponse.statusCode === 200 && Array.isArray(projectAreasResponse.body)) {
      console.log(`✅ Project areas retrieved: ${projectAreasResponse.body.length} areas`);
      testResults.push({ test: 'Project Areas', status: 'PASS', statusCode: projectAreasResponse.statusCode });
    } else {
      console.log('❌ Project areas failed:', projectAreasResponse.statusCode, projectAreasResponse.body);
      testResults.push({ test: 'Project Areas', status: 'FAIL', statusCode: projectAreasResponse.statusCode });
    }

    // Test 12: Content History
    console.log('\n12. Testing Content History');
    const contentHistoryResponse = await makeRequest('GET', '/content/history/my', null, creatorToken);
    
    if (contentHistoryResponse.statusCode === 200 && Array.isArray(contentHistoryResponse.body)) {
      console.log(`✅ Content history retrieved: ${contentHistoryResponse.body.length} history records`);
      testResults.push({ test: 'Content History', status: 'PASS', statusCode: contentHistoryResponse.statusCode });
    } else {
      console.log('❌ Content history failed:', contentHistoryResponse.statusCode, contentHistoryResponse.body);
      testResults.push({ test: 'Content History', status: 'FAIL', statusCode: contentHistoryResponse.statusCode });
    }

    // Test 13: Project History
    console.log('\n13. Testing Project History');
    const projectHistoryResponse = await makeRequest('GET', '/projects/history/my', null, creatorToken);
    
    if (projectHistoryResponse.statusCode === 200 && Array.isArray(projectHistoryResponse.body)) {
      console.log(`✅ Project history retrieved: ${projectHistoryResponse.body.length} history records`);
      testResults.push({ test: 'Project History', status: 'PASS', statusCode: projectHistoryResponse.statusCode });
    } else {
      console.log('❌ Project history failed:', projectHistoryResponse.statusCode, projectHistoryResponse.body);
      testResults.push({ test: 'Project History', status: 'FAIL', statusCode: projectHistoryResponse.statusCode });
    }

    // Test 14: Health Check
    console.log('\n14. Testing Health Check');
    const healthResponse = await makeRequest('GET', '/docs/health');
    
    if (healthResponse.statusCode === 200) {
      console.log('✅ Health check passed');
      testResults.push({ test: 'Health Check', status: 'PASS', statusCode: healthResponse.statusCode });
    } else {
      console.log('❌ Health check failed:', healthResponse.statusCode, healthResponse.body);
      testResults.push({ test: 'Health Check', status: 'FAIL', statusCode: healthResponse.statusCode });
    }

    // Test 15: API Documentation
    console.log('\n15. Testing API Documentation');
    const docsResponse = await makeRequest('GET', '/docs');
    
    if (docsResponse.statusCode === 200) {
      console.log('✅ API documentation accessible');
      testResults.push({ test: 'API Documentation', status: 'PASS', statusCode: docsResponse.statusCode });
    } else {
      console.log('❌ API documentation failed:', docsResponse.statusCode, docsResponse.body);
      testResults.push({ test: 'API Documentation', status: 'FAIL', statusCode: docsResponse.statusCode });
    }

  } catch (error) {
    console.error('❌ Test execution error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passedTests = testResults.filter(result => result.status === 'PASS');
  const failedTests = testResults.filter(result => result.status === 'FAIL');
  
  console.log(`✅ Passed: ${passedTests.length}`);
  console.log(`❌ Failed: ${failedTests.length}`);
  console.log(`📈 Success Rate: ${((passedTests.length / testResults.length) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detailed Results:');
  testResults.forEach((result, index) => {
    const status = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.test} (${result.statusCode})`);
  });

  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`   - ${test.test} (Status: ${test.statusCode})`);
    });
  }

  console.log('\n🎉 Endpoint testing completed!');
}

// Run the tests
testEndpoints().catch(console.error); 