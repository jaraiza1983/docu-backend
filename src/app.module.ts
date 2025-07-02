import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContentModule } from './content/content.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ProjectsModule } from './projects/projects.module';
import { DocsModule } from './docs/docs.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    ContentModule,
    CategoriesModule,
    SubcategoriesModule,
    ProjectsModule,
    DocsModule,
  ],
})
export class AppModule {} 