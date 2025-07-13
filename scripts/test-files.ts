import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

interface FileResponse {
  id: number;
  originalName: string;
  filename: string;
  extension: string;
  size: number;
  mimeType: string;
  description?: string;
  uploadedBy: {
    id: number;
    username: string;
  };
  uploadedAt: string;
}

class FileTestSuite {
  private adminToken: string = '';
  private editorToken: string = '';
  private viewerToken: string = '';
  private uploadedFileId: number = 0;

  async runTests() {
    console.log('🚀 Starting File Management Test Suite...\n');

    try {
      await this.loginUsers();
      await this.testFileUpload();
      await this.testFileListing();
      await this.testFileFilters();
      await this.testFileDownload();
      await this.testFileUpdate();
      await this.testFileDelete();
      await this.testRoleBasedAccess();
      await this.testFileStats();

      console.log('\n✅ All file management tests passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      process.exit(1);
    }
  }

  private async loginUsers() {
    console.log('🔐 Logging in users...');

    // Admin login
    const adminResponse = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123',
    });
    this.adminToken = adminResponse.data.access_token;
    console.log('✅ Admin logged in');

    // Editor login
    const editorResponse = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, {
      username: 'editor',
      password: 'editor123',
    });
    this.editorToken = editorResponse.data.access_token;
    console.log('✅ Editor logged in');

    // Viewer login
    const viewerResponse = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, {
      username: 'viewer',
      password: 'viewer123',
    });
    this.viewerToken = viewerResponse.data.access_token;
    console.log('✅ Viewer logged in\n');
  }

  private async testFileUpload() {
    console.log('📤 Testing file upload...');

    // Create a test file
    const testContent = 'This is a test PDF content for file upload testing.';
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, testContent);

    try {
      const formData = new FormData();
      const fileBuffer = fs.readFileSync(testFilePath);
      const blob = new Blob([fileBuffer], { type: 'text/plain' });
      formData.append('file', blob, 'test-document.txt');
      formData.append('description', 'Test file for upload testing');

      const response = await axios.post<FileResponse>(
        `${BASE_URL}/files/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.adminToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      this.uploadedFileId = response.data.id;
      console.log(`✅ File uploaded successfully. ID: ${this.uploadedFileId}`);
      console.log(`   Original name: ${response.data.originalName}`);
      console.log(`   Size: ${response.data.size} bytes`);
      console.log(`   Description: ${response.data.description}`);

    } finally {
      // Clean up test file
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
  }

  private async testFileListing() {
    console.log('\n📋 Testing file listing...');

    const response = await axios.get(`${BASE_URL}/files`, {
      headers: {
        'Authorization': `Bearer ${this.adminToken}`,
      },
    });

    const { files, total, page, limit } = response.data;
    console.log(`✅ Files listed successfully. Total: ${total}, Page: ${page}, Limit: ${limit}`);
    console.log(`   Found ${files.length} files in current page`);

    if (files.length > 0) {
      const file = files[0];
      console.log(`   Sample file: ${file.originalName} (${file.extension})`);
    }
  }

  private async testFileFilters() {
    console.log('\n🔍 Testing file filters...');

    // Test name filter
    const nameFilterResponse = await axios.get(`${BASE_URL}/files?name=test`, {
      headers: {
        'Authorization': `Bearer ${this.adminToken}`,
      },
    });
    console.log(`✅ Name filter: Found ${nameFilterResponse.data.files.length} files with 'test' in name`);

    // Test extension filter
    const extensionFilterResponse = await axios.get(`${BASE_URL}/files?extension=txt`, {
      headers: {
        'Authorization': `Bearer ${this.adminToken}`,
      },
    });
    console.log(`✅ Extension filter: Found ${extensionFilterResponse.data.files.length} .txt files`);

    // Test pagination
    const paginationResponse = await axios.get(`${BASE_URL}/files?page=1&limit=5`, {
      headers: {
        'Authorization': `Bearer ${this.adminToken}`,
      },
    });
    console.log(`✅ Pagination: Page ${paginationResponse.data.page} with ${paginationResponse.data.files.length} files`);
  }

  private async testFileDownload() {
    console.log('\n📥 Testing file download...');

    // Test download with authentication
    const response = await axios.get(`${BASE_URL}/files/${this.uploadedFileId}/download`, {
      headers: {
        'Authorization': `Bearer ${this.adminToken}`,
      },
      responseType: 'stream',
    });

    console.log(`✅ File download with authentication successful`);
    console.log(`   Content-Type: ${response.headers['content-type']}`);
    console.log(`   Content-Disposition: ${response.headers['content-disposition']}`);

    // Test download without authentication (public access)
    const publicResponse = await axios.get(`${BASE_URL}/files/${this.uploadedFileId}/download`, {
      responseType: 'stream',
    });

    console.log(`✅ File download without authentication successful (public access)`);
    console.log(`   Content-Type: ${publicResponse.headers['content-type']}`);
    console.log(`   Content-Disposition: ${publicResponse.headers['content-disposition']}`);
  }

  private async testFileUpdate() {
    console.log('\n✏️ Testing file update...');

    const updateData = {
      description: 'Updated description for testing purposes',
    };

    const response = await axios.patch<FileResponse>(
      `${BASE_URL}/files/${this.uploadedFileId}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${this.adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ File updated successfully`);
    console.log(`   New description: ${response.data.description}`);
  }

  private async testFileDelete() {
    console.log('\n🗑️ Testing file deletion...');

    // First, upload another file to delete
    const testContent = 'File to be deleted';
    const testFilePath = path.join(__dirname, 'delete-test.txt');
    fs.writeFileSync(testFilePath, testContent);

    try {
      const formData = new FormData();
      const fileBuffer = fs.readFileSync(testFilePath);
      const blob = new Blob([fileBuffer], { type: 'text/plain' });
      formData.append('file', blob, 'delete-test.txt');

      const uploadResponse = await axios.post<FileResponse>(
        `${BASE_URL}/files/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.adminToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const fileToDeleteId = uploadResponse.data.id;

      // Delete the file
      await axios.delete(`${BASE_URL}/files/${fileToDeleteId}`, {
        headers: {
          'Authorization': `Bearer ${this.adminToken}`,
        },
      });

      console.log(`✅ File deleted successfully. ID: ${fileToDeleteId}`);

      // Verify file is no longer accessible
      try {
        await axios.get(`${BASE_URL}/files/${fileToDeleteId}`, {
          headers: {
            'Authorization': `Bearer ${this.adminToken}`,
          },
        });
        throw new Error('File should not be accessible after deletion');
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('✅ File properly removed from access');
        } else {
          throw error;
        }
      }

    } finally {
      // Clean up test file
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
  }

  private async testRoleBasedAccess() {
    console.log('\n🔒 Testing role-based access...');

    // Test that non-admin users cannot upload files
    try {
      const formData = new FormData();
      const testContent = 'Unauthorized upload test';
      const blob = new Blob([testContent], { type: 'text/plain' });
      formData.append('file', blob, 'unauthorized.txt');

      await axios.post(`${BASE_URL}/files/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${this.editorToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      throw new Error('Editor should not be able to upload files');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Editor correctly denied file upload access');
      } else {
        throw error;
      }
    }

    // Test that non-admin users cannot delete files
    try {
      await axios.delete(`${BASE_URL}/files/${this.uploadedFileId}`, {
        headers: {
          'Authorization': `Bearer ${this.editorToken}`,
        },
      });

      throw new Error('Editor should not be able to delete files');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Editor correctly denied file deletion access');
      } else {
        throw error;
      }
    }

    // Test that all users can download files
    const downloadResponse = await axios.get(`${BASE_URL}/files/${this.uploadedFileId}/download`, {
      headers: {
        'Authorization': `Bearer ${this.viewerToken}`,
      },
      responseType: 'stream',
    });

    console.log(`✅ Viewer can download files (Status: ${downloadResponse.status})`);
  }

  private async testFileStats() {
    console.log('\n📊 Testing file statistics...');

    const response = await axios.get(`${BASE_URL}/files/stats`, {
      headers: {
        'Authorization': `Bearer ${this.adminToken}`,
      },
    });

    const { allowedExtensions, maxFileSize } = response.data;
    console.log(`✅ File statistics retrieved successfully`);
    console.log(`   Allowed extensions: ${allowedExtensions.join(', ')}`);
    console.log(`   Max file size: ${maxFileSize / (1024 * 1024)} MB`);
  }
}

// Run the test suite
async function main() {
  const testSuite = new FileTestSuite();
  await testSuite.runTests();
}

main().catch(console.error); 