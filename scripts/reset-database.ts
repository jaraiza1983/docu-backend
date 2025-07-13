import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../src/users/entities/user.entity';
import { Category } from '../src/categories/entities/category.entity';
import { ProjectCategory } from '../src/project-categories/entities/project-category.entity';
import { Topic } from '../src/topics/entities/topic.entity';
import { Project } from '../src/projects/entities/project.entity';

async function resetDatabase() {
  console.log('🔄 Starting database reset...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Drop all tables
    console.log('🗑️  Dropping all tables...');
    await dataSource.dropDatabase();
    
    // Synchronize schema
    console.log('📋 Creating database schema...');
    await dataSource.synchronize();

    // Create sample users
    console.log('👥 Creating sample users...');
    const userRepository = dataSource.getRepository(User);
    
    const adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
      isActive: true,
    });

    const editorUser = userRepository.create({
      username: 'editor',
      email: 'editor@example.com',
      firstName: 'Editor',
      lastName: 'User',
      password: await bcrypt.hash('editor123', 10),
      role: UserRole.EDITOR,
      isActive: true,
    });

    const viewerUser = userRepository.create({
      username: 'viewer',
      email: 'viewer@example.com',
      firstName: 'Viewer',
      lastName: 'User',
      password: await bcrypt.hash('viewer123', 10),
      role: UserRole.VIEWER,
      isActive: true,
    });

    const savedUsers = await userRepository.save([adminUser, editorUser, viewerUser]);
    console.log(`✅ Created ${savedUsers.length} users`);

    // Create sample categories
    console.log('📂 Creating sample categories...');
    const categoryRepository = dataSource.getRepository(Category);
    
    const technologyCategory = categoryRepository.create({
      name: 'Technology',
      description: 'Technology related topics',
    });

    const businessCategory = categoryRepository.create({
      name: 'Business',
      description: 'Business and management topics',
    });

    const savedCategories = await categoryRepository.save([technologyCategory, businessCategory]);

    // Create subcategories
    const webDevSubcategory = categoryRepository.create({
      name: 'Web Development',
      description: 'Web development topics',
      parentId: savedCategories[0].id,
    });

    const mobileDevSubcategory = categoryRepository.create({
      name: 'Mobile Development',
      description: 'Mobile development topics',
      parentId: savedCategories[0].id,
    });

    const marketingSubcategory = categoryRepository.create({
      name: 'Marketing',
      description: 'Marketing topics',
      parentId: savedCategories[1].id,
    });

    await categoryRepository.save([webDevSubcategory, mobileDevSubcategory, marketingSubcategory]);
    console.log('✅ Created categories and subcategories');

    // Create sample project categories
    console.log('📁 Creating sample project categories...');
    const projectCategoryRepository = dataSource.getRepository(ProjectCategory);
    
    const webProjectCategory = projectCategoryRepository.create({
      name: 'Web Projects',
      description: 'Web development projects',
    });

    const mobileProjectCategory = projectCategoryRepository.create({
      name: 'Mobile Projects',
      description: 'Mobile development projects',
    });

    const businessProjectCategory = projectCategoryRepository.create({
      name: 'Business Projects',
      description: 'Business and management projects',
    });

    await projectCategoryRepository.save([webProjectCategory, mobileProjectCategory, businessProjectCategory]);
    console.log('✅ Created project categories');

    // Create sample topics
    console.log('📝 Creating sample topics...');
    const topicRepository = dataSource.getRepository(Topic);
    
    const topic1 = topicRepository.create({
      title: 'Introduction to NestJS',
      body: 'NestJS is a progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications. It uses TypeScript and combines elements of OOP, FP, and FRP.',
      categoryId: savedCategories[0].id,
      subcategoryId: webDevSubcategory.id,
      createdById: savedUsers[0].id,
    });

    const topic2 = topicRepository.create({
      title: 'React vs Angular: A Comparison',
      body: 'Both React and Angular are popular frontend frameworks, but they have different approaches to building user interfaces. React is more flexible while Angular provides more structure out of the box.',
      categoryId: savedCategories[0].id,
      subcategoryId: webDevSubcategory.id,
      createdById: savedUsers[1].id,
    });

    const topic3 = topicRepository.create({
      title: 'Digital Marketing Strategies',
      body: 'Digital marketing encompasses all marketing efforts that use electronic devices or the internet. Businesses leverage digital channels such as search engines, social media, email, and websites to connect with current and prospective customers.',
      categoryId: savedCategories[1].id,
      subcategoryId: marketingSubcategory.id,
      createdById: savedUsers[0].id,
    });

    await topicRepository.save([topic1, topic2, topic3]);
    console.log('✅ Created sample topics');

    // Create sample projects
    console.log('🚀 Creating sample projects...');
    const projectRepository = dataSource.getRepository(Project);
    
    const project1 = projectRepository.create({
      title: 'E-commerce Platform',
      body: 'A comprehensive e-commerce platform built with modern technologies including React, Node.js, and PostgreSQL. Features include user authentication, product management, shopping cart, and payment processing.',
      categoryId: webProjectCategory.id,
      createdById: savedUsers[0].id,
    });

    const project2 = projectRepository.create({
      title: 'Mobile Banking App',
      body: 'A secure mobile banking application developed with React Native. Includes features like account management, fund transfers, bill payments, and real-time notifications.',
      categoryId: mobileProjectCategory.id,
      createdById: savedUsers[1].id,
    });

    const project3 = projectRepository.create({
      title: 'Business Analytics Dashboard',
      body: 'A comprehensive business analytics dashboard that provides real-time insights into key performance indicators, sales metrics, and customer behavior analysis.',
      categoryId: businessProjectCategory.id,
      createdById: savedUsers[0].id,
    });

    await projectRepository.save([project1, project2, project3]);
    console.log('✅ Created sample projects');

    console.log('\n🎉 Database reset completed successfully!');
    console.log('\n📋 Sample Data Summary:');
    console.log(`- Users: ${savedUsers.length} (admin, editor, viewer)`);
    console.log('- Categories: 2 main categories with 3 subcategories');
    console.log('- Project Categories: 3 categories');
    console.log('- Topics: 3 sample topics');
    console.log('- Projects: 3 sample projects');
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin / admin123');
    console.log('Editor: editor / editor123');
    console.log('Viewer: viewer / viewer123');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

resetDatabase().catch(console.error); 