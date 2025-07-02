import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Content } from './src/content/entities/content.entity';
import { ContentHistory } from './src/content/entities/content-history.entity';
import { Category } from './src/categories/entities/category.entity';
import { Subcategory } from './src/subcategories/entities/subcategory.entity';
import { Project } from './src/projects/entities/project.entity';
import { ProjectStatus } from './src/projects/entities/project-status.entity';
import { ProjectArea } from './src/projects/entities/project-area.entity';
import { ProjectHistory } from './src/projects/entities/project-history.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [
    User, 
    Content, 
    ContentHistory, 
    Category, 
    Subcategory,
    Project,
    ProjectStatus,
    ProjectArea,
    ProjectHistory,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default AppDataSource; 