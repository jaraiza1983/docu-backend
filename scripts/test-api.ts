import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
  duration?: number;
}

class ApiTester {
  private results: TestResult[] = [];
  private tokens: { [key: string]: string } = {};

  async runTests() {
    console.log('🧪 Starting API Tests...\n');

    // Reset database first
    await this.resetDatabase();

    // Test authentication
    await this.testAuthentication();

    // Test user management (admin only)
    await this.testUserManagement();

    // Test category management (admin only)
    await this.testCategoryManagement();

    // Test project category management (admin only)
    await this.testProjectCategoryManagement();

    // Test topic management
    await this.testTopicManagement();

    // Test project management
    await this.testProjectManagement();

    // Test role-based access control
    await this.testRoleBasedAccess();

    // Print results
    this.printResults();

    // Reset database after testing
    await this.resetDatabase();
  }

  private async resetDatabase() {
    console.log('🔄 Resetting database...');
    try {
      const { exec } = require('child_process');
      await new Promise((resolve, reject) => {
        exec('npm run reset-db', (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.error('Error resetting database:', error);
            reject(error);
          } else {
            console.log('✅ Database reset completed');
            resolve(stdout);
          }
        });
      });
    } catch (error) {
      console.error('❌ Failed to reset database:', error);
    }
  }

  private async testAuthentication() {
    console.log('🔐 Testing Authentication...');

    // Test admin login
    await this.testLogin('admin', 'admin123', 'admin');

    // Test editor login
    await this.testLogin('editor', 'editor123', 'editor');

    // Test viewer login
    await this.testLogin('viewer', 'viewer123', 'viewer');

    // Test invalid login
    await this.testInvalidLogin();
  }

  private async testLogin(username: string, password: string, role: string) {
    const startTime = Date.now();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });

      if (response.status === 200 && response.data.access_token) {
        this.tokens[role] = response.data.access_token;
        this.addResult(`Login ${role}`, 'PASS', 'Login successful', Date.now() - startTime);
      } else {
        this.addResult(`Login ${role}`, 'FAIL', 'Login failed - no token received');
      }
    } catch (error) {
      this.addResult(`Login ${role}`, 'FAIL', `Login failed: ${error.response?.data?.message || error.message}`);
    }
  }

  private async testInvalidLogin() {
    const startTime = Date.now();
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'invalid',
        password: 'invalid',
      });
      this.addResult('Invalid Login', 'FAIL', 'Should have failed with invalid credentials', Date.now() - startTime);
    } catch (error) {
      if (error.response?.status === 401) {
        this.addResult('Invalid Login', 'PASS', 'Correctly rejected invalid credentials', Date.now() - startTime);
      } else {
        this.addResult('Invalid Login', 'FAIL', `Unexpected error: ${error.message}`);
      }
    }
  }

  private async testUserManagement() {
    console.log('👥 Testing User Management...');

    const headers = { Authorization: `Bearer ${this.tokens.admin}` };

    // Test get all users (admin only)
    await this.testEndpoint('GET /users', 'PASS', () => 
      axios.get(`${BASE_URL}/users`, { headers })
    );

    // Test create user (admin only)
    await this.testEndpoint('POST /users', 'PASS', () => 
      axios.post(`${BASE_URL}/users`, {
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
        role: 'viewer'
      }, { headers })
    );

    // Test get user by ID
    await this.testEndpoint('GET /users/1', 'PASS', () => 
      axios.get(`${BASE_URL}/users/1`, { headers })
    );
  }

  private async testCategoryManagement() {
    console.log('📂 Testing Category Management...');

    const headers = { Authorization: `Bearer ${this.tokens.admin}` };

    // Test create category (admin only)
    await this.testEndpoint('POST /categories', 'PASS', () => 
      axios.post(`${BASE_URL}/categories`, {
        name: 'Test Category',
        description: 'Test category description'
      }, { headers })
    );

    // Test get all categories
    await this.testEndpoint('GET /categories', 'PASS', () => 
      axios.get(`${BASE_URL}/categories`)
    );

    // Test get root categories
    await this.testEndpoint('GET /categories/root', 'PASS', () => 
      axios.get(`${BASE_URL}/categories/root`)
    );

    // Test get category by ID
    await this.testEndpoint('GET /categories/1', 'PASS', () => 
      axios.get(`${BASE_URL}/categories/1`)
    );
  }

  private async testProjectCategoryManagement() {
    console.log('📁 Testing Project Category Management...');

    const headers = { Authorization: `Bearer ${this.tokens.admin}` };

    // Test create project category (admin only)
    await this.testEndpoint('POST /project-categories', 'PASS', () => 
      axios.post(`${BASE_URL}/project-categories`, {
        name: 'Test Project Category',
        description: 'Test project category description'
      }, { headers })
    );

    // Test get all project categories
    await this.testEndpoint('GET /project-categories', 'PASS', () => 
      axios.get(`${BASE_URL}/project-categories`)
    );

    // Test get root project categories
    await this.testEndpoint('GET /project-categories/root', 'PASS', () => 
      axios.get(`${BASE_URL}/project-categories/root`)
    );
  }

  private async testTopicManagement() {
    console.log('📝 Testing Topic Management...');

    const adminHeaders = { Authorization: `Bearer ${this.tokens.admin}` };
    const editorHeaders = { Authorization: `Bearer ${this.tokens.editor}` };

    // Test create topic (admin/editor only)
    await this.testEndpoint('POST /topics (admin)', 'PASS', () => 
      axios.post(`${BASE_URL}/topics`, {
        title: 'Test Topic',
        body: 'Test topic body content',
        categoryId: 1,
        subcategoryId: 3
      }, { headers: adminHeaders })
    );

    await this.testEndpoint('POST /topics (editor)', 'PASS', () => 
      axios.post(`${BASE_URL}/topics`, {
        title: 'Editor Topic',
        body: 'Editor topic body content',
        categoryId: 1,
        subcategoryId: 3
      }, { headers: editorHeaders })
    );

    // Test get all topics
    await this.testEndpoint('GET /topics', 'PASS', () => 
      axios.get(`${BASE_URL}/topics`)
    );

    // Test get topics by category
    await this.testEndpoint('GET /topics/category/1', 'PASS', () => 
      axios.get(`${BASE_URL}/topics/category/1`)
    );

    // Test get topic by ID
    await this.testEndpoint('GET /topics/1', 'PASS', () => 
      axios.get(`${BASE_URL}/topics/1`)
    );
  }

  private async testProjectManagement() {
    console.log('🚀 Testing Project Management...');

    const adminHeaders = { Authorization: `Bearer ${this.tokens.admin}` };
    const editorHeaders = { Authorization: `Bearer ${this.tokens.editor}` };

    // Test create project (admin/editor only)
    await this.testEndpoint('POST /projects (admin)', 'PASS', () => 
      axios.post(`${BASE_URL}/projects`, {
        title: 'Test Project',
        body: 'Test project body content',
        categoryId: 1
      }, { headers: adminHeaders })
    );

    await this.testEndpoint('POST /projects (editor)', 'PASS', () => 
      axios.post(`${BASE_URL}/projects`, {
        title: 'Editor Project',
        body: 'Editor project body content',
        categoryId: 1
      }, { headers: editorHeaders })
    );

    // Test get all projects
    await this.testEndpoint('GET /projects', 'PASS', () => 
      axios.get(`${BASE_URL}/projects`)
    );

    // Test get projects by category
    await this.testEndpoint('GET /projects/category/1', 'PASS', () => 
      axios.get(`${BASE_URL}/projects/category/1`)
    );

    // Test get project by ID
    await this.testEndpoint('GET /projects/1', 'PASS', () => 
      axios.get(`${BASE_URL}/projects/1`)
    );
  }

  private async testRoleBasedAccess() {
    console.log('🔒 Testing Role-Based Access Control...');

    const viewerHeaders = { Authorization: `Bearer ${this.tokens.viewer}` };

    // Test viewer cannot create topics
    await this.testEndpoint('POST /topics (viewer - should fail)', 'PASS', async () => {
      try {
        await axios.post(`${BASE_URL}/topics`, {
          title: 'Viewer Topic',
          body: 'Viewer topic body',
          categoryId: 1
        }, { headers: viewerHeaders });
        throw new Error('Should have failed');
      } catch (error) {
        if (error.response?.status === 403) {
          return { status: 403 };
        }
        throw error;
      }
    });

    // Test viewer cannot create projects
    await this.testEndpoint('POST /projects (viewer - should fail)', 'PASS', async () => {
      try {
        await axios.post(`${BASE_URL}/projects`, {
          title: 'Viewer Project',
          body: 'Viewer project body',
          categoryId: 1
        }, { headers: viewerHeaders });
        throw new Error('Should have failed');
      } catch (error) {
        if (error.response?.status === 403) {
          return { status: 403 };
        }
        throw error;
      }
    });

    // Test viewer cannot access user management
    await this.testEndpoint('GET /users (viewer - should fail)', 'PASS', async () => {
      try {
        await axios.get(`${BASE_URL}/users`, { headers: viewerHeaders });
        throw new Error('Should have failed');
      } catch (error) {
        if (error.response?.status === 403) {
          return { status: 403 };
        }
        throw error;
      }
    });
  }

  private async testEndpoint(name: string, expectedStatus: 'PASS' | 'FAIL', testFn: () => Promise<any>) {
    const startTime = Date.now();
    try {
      const response = await testFn();
      if (response.status >= 200 && response.status < 300) {
        this.addResult(name, 'PASS', 'Request successful', Date.now() - startTime);
      } else {
        this.addResult(name, 'FAIL', `Unexpected status: ${response.status}`);
      }
    } catch (error) {
      if (expectedStatus === 'FAIL') {
        this.addResult(name, 'PASS', `Correctly failed: ${error.response?.data?.message || error.message}`, Date.now() - startTime);
      } else {
        this.addResult(name, 'FAIL', `Request failed: ${error.response?.data?.message || error.message}`);
      }
    }
  }

  private addResult(name: string, status: 'PASS' | 'FAIL', message: string, duration?: number) {
    this.results.push({ name, status, message, duration });
  }

  private printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    console.log('\n📋 Detailed Results:');
    console.log('-'.repeat(50));

    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      const duration = result.duration ? ` (${result.duration}ms)` : '';
      console.log(`${icon} ${result.name}${duration}`);
      if (result.status === 'FAIL') {
        console.log(`   Error: ${result.message}`);
      }
    });

    if (failed > 0) {
      console.log('\n❌ Some tests failed. Please check the errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed successfully!');
    }
  }
}

// Run tests
const tester = new ApiTester();
tester.runTests().catch(console.error); 