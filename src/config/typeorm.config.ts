import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { ContentHistory } from '../content/entities/content-history.entity';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from '../subcategories/entities/subcategory.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectStatus } from '../projects/entities/project-status.entity';
import { ProjectArea } from '../projects/entities/project-area.entity';
import { ProjectHistory } from '../projects/entities/project-history.entity';

export const typeOrmConfig: DataSourceOptions = {
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
  synchronize: true, // Set to false in production
  logging: true,
};

export const AppDataSource = new DataSource({
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