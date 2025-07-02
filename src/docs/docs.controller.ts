import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('docs')
export class DocsController {
  @Get('api-spec')
  getApiSpec(@Res() res: Response) {
    try {
      const apiSpecPath = path.join(process.cwd(), 'api-spec.json');
      
      // Check if file exists
      if (!fs.existsSync(apiSpecPath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'API specification file not found',
          error: 'Not Found'
        });
      }

      const apiSpec = fs.readFileSync(apiSpecPath, 'utf8');
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      
      return res.json(JSON.parse(apiSpec));
    } catch (error) {
      console.error('Error reading API spec file:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error loading API documentation',
        error: 'Internal Server Error'
      });
    }
  }

  @Get('markdown')
  getMarkdownDocs(@Res() res: Response) {
    try {
      const markdownPath = path.join(process.cwd(), 'API_DOCUMENTATION.md');
      
      // Check if file exists
      if (!fs.existsSync(markdownPath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Markdown documentation file not found',
          error: 'Not Found'
        });
      }

      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      
      return res.send(markdownContent);
    } catch (error) {
      console.error('Error reading Markdown file:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error loading Markdown documentation',
        error: 'Internal Server Error'
      });
    }
  }

  @Get()
  getDocsInfo(@Res() res: Response) {
    const docsInfo = {
      message: 'Docu Backend API Documentation',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        'GET /docs': 'General documentation information',
        'GET /docs/api-spec': 'Complete API specification in JSON format',
        'GET /docs/markdown': 'Documentation in Markdown format'
      },
      usage: {
        description: 'This API provides endpoints for managing users and content',
        authentication: 'JWT Bearer Token (except for login and register)',
        baseUrl: 'http://localhost:3000/api',
        documentation: 'Check /docs/api-spec for complete specification'
      },
      examples: {
        curl: {
          apiSpec: 'curl -X GET http://localhost:3000/api/docs/api-spec',
          markdown: 'curl -X GET http://localhost:3000/api/docs/markdown'
        },
        javascript: {
          apiSpec: 'fetch("http://localhost:3000/api/docs/api-spec").then(r => r.json())',
          markdown: 'fetch("http://localhost:3000/api/docs/markdown").then(r => r.text())'
        }
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.json(docsInfo);
  }

  @Get('health')
  getHealth(@Res() res: Response) {
    const healthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'API Documentation Service',
      version: '1.0.0',
      files: {
        apiSpec: fs.existsSync(path.join(process.cwd(), 'api-spec.json')),
        markdown: fs.existsSync(path.join(process.cwd(), 'API_DOCUMENTATION.md'))
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.json(healthInfo);
  }
} 