const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

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

async function testAccessControl() {
  console.log('🔐 Testing Updated Role-Based Access Control...\n');

  try {
    // Test 1: Admin Login
    console.log('1. Testing Admin Login');
    const adminLoginResponse = await makeRequest('POST', '/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    if (adminLoginResponse.statusCode !== 200) {
      console.log('❌ Admin login failed');
      return;
    }
    
    const adminToken = adminLoginResponse.body.access_token;
    console.log('✅ Admin login successful');

    // Test 2: Creator Login
    console.log('\n2. Testing Creator Login');
    const creatorLoginResponse = await makeRequest('POST', '/auth/login', {
      email: 'jane@example.com',
      password: 'password123'
    });
    
    if (creatorLoginResponse.statusCode !== 200) {
      console.log('❌ Creator login failed');
      return;
    }
    
    const creatorToken = creatorLoginResponse.body.access_token;
    console.log('✅ Creator login successful');

    // Test 3: Admin sees all content
    console.log('\n3. Testing Admin - Get All Content');
    const adminContentResponse = await makeRequest('GET', '/content', null, adminToken);
    
    if (adminContentResponse.statusCode === 200) {
      const contentCount = Array.isArray(adminContentResponse.body) ? adminContentResponse.body.length : 0;
      console.log(`✅ Admin sees ${contentCount} content items`);
      
      if (Array.isArray(adminContentResponse.body)) {
        adminContentResponse.body.forEach(content => {
          console.log(`   - Content ID: ${content.id}, Title: "${content.title}", Author: ${content.author?.name} (${content.author?.role})`);
        });
      }
    } else {
      console.log('❌ Admin content access failed:', adminContentResponse.statusCode);
    }

    // Test 4: Creator sees all content (NEW RULE)
    console.log('\n4. Testing Creator - Get All Content (should see all content now)');
    const creatorContentResponse = await makeRequest('GET', '/content', null, creatorToken);
    
    if (creatorContentResponse.statusCode === 200) {
      const contentCount = Array.isArray(creatorContentResponse.body) ? creatorContentResponse.body.length : 0;
      console.log(`✅ Creator sees ${contentCount} content items (all content)`);
      
      if (Array.isArray(creatorContentResponse.body)) {
        creatorContentResponse.body.forEach(content => {
          console.log(`   - Content ID: ${content.id}, Title: "${content.title}", Author: ${content.author?.name} (${content.author?.role})`);
        });
      }
    } else {
      console.log('❌ Creator content access failed:', creatorContentResponse.statusCode);
    }

    // Test 5: Admin sees all projects
    console.log('\n5. Testing Admin - Get All Projects');
    const adminProjectsResponse = await makeRequest('GET', '/projects', null, adminToken);
    
    if (adminProjectsResponse.statusCode === 200) {
      const projectsCount = Array.isArray(adminProjectsResponse.body) ? adminProjectsResponse.body.length : 0;
      console.log(`✅ Admin sees ${projectsCount} projects`);
      
      if (Array.isArray(adminProjectsResponse.body)) {
        adminProjectsResponse.body.forEach(project => {
          console.log(`   - Project ID: ${project.id}, Title: "${project.title}", Author: ${project.author?.name} (${project.author?.role})`);
        });
      }
    } else {
      console.log('❌ Admin projects access failed:', adminProjectsResponse.statusCode);
    }

    // Test 6: Creator sees all projects (NEW RULE)
    console.log('\n6. Testing Creator - Get All Projects (should see all projects now)');
    const creatorProjectsResponse = await makeRequest('GET', '/projects', null, creatorToken);
    
    if (creatorProjectsResponse.statusCode === 200) {
      const projectsCount = Array.isArray(creatorProjectsResponse.body) ? creatorProjectsResponse.body.length : 0;
      console.log(`✅ Creator sees ${projectsCount} projects (all projects)`);
      
      if (Array.isArray(creatorProjectsResponse.body)) {
        creatorProjectsResponse.body.forEach(project => {
          console.log(`   - Project ID: ${project.id}, Title: "${project.title}", Author: ${project.author?.name} (${project.author?.role})`);
        });
      }
    } else {
      console.log('❌ Creator projects access failed:', creatorProjectsResponse.statusCode);
    }

    // Test 7: Creator can access admin's content (NEW RULE)
    console.log('\n7. Testing Creator - Access Admin Content (should succeed now)');
    const creatorAccessAdminContent = await makeRequest('GET', '/content/40', null, creatorToken);
    
    if (creatorAccessAdminContent.statusCode === 200) {
      console.log('✅ Creator can now access admin content');
    } else {
      console.log(`❌ Creator should access admin content but got status: ${creatorAccessAdminContent.statusCode}`);
    }

    // Test 8: Admin can access any content
    console.log('\n8. Testing Admin - Access Any Content (should succeed)');
    const adminAccessAnyContent = await makeRequest('GET', '/content/40', null, adminToken);
    
    if (adminAccessAnyContent.statusCode === 200) {
      console.log('✅ Admin can access any content');
    } else {
      console.log(`❌ Admin should access any content but got status: ${adminAccessAnyContent.statusCode}`);
    }

    // Test 9: Creator can update any content (NEW RULE)
    console.log('\n9. Testing Creator - Update Any Content (should succeed now)');
    const creatorUpdateContent = await makeRequest('PATCH', '/content/40', {
      title: 'Updated by Creator',
      description: 'This content was updated by a creator'
    }, creatorToken);
    
    if (creatorUpdateContent.statusCode === 200) {
      console.log('✅ Creator can now update any content');
    } else {
      console.log(`❌ Creator should update any content but got status: ${creatorUpdateContent.statusCode}`);
    }

    // Test 10: Creator can only update their own projects (EXISTING RULE)
    console.log('\n10. Testing Creator - Update Own Project (should succeed)');
    // First, let's find a project owned by the creator
    const creatorProjects = await makeRequest('GET', '/projects', null, creatorToken);
    let creatorOwnedProjectId = null;
    
    if (creatorProjects.statusCode === 200 && Array.isArray(creatorProjects.body)) {
      const ownProject = creatorProjects.body.find(p => p.author?.id === 8); // Jane's ID
      if (ownProject) {
        creatorOwnedProjectId = ownProject.id;
      }
    }
    
    if (creatorOwnedProjectId) {
      const creatorUpdateOwnProject = await makeRequest('PATCH', `/projects/${creatorOwnedProjectId}`, {
        title: 'Updated by Creator (Own Project)',
        description: 'This project was updated by its creator'
      }, creatorToken);
      
      if (creatorUpdateOwnProject.statusCode === 200) {
        console.log('✅ Creator can update their own project');
      } else {
        console.log(`❌ Creator should update own project but got status: ${creatorUpdateOwnProject.statusCode}`);
      }
    } else {
      console.log('⚠️  No creator-owned project found to test');
    }

  } catch (error) {
    console.error('❌ Test execution error:', error.message);
  }

  console.log('\n🎉 Updated Access Control Testing Completed!');
}

testAccessControl().catch(console.error); 