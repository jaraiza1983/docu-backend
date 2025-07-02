import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ContentService, ContentQueryOptions } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('content')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CREATOR, UserRole.ADMIN)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Body() createContentDto: CreateContentDto, @Request() req) {
    return this.contentService.create(createContentDto, req.user);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('orderBy') orderBy?: 'priority' | 'createdAt' | 'updatedAt' | 'title',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: ContentQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    return this.contentService.findAll(req.user, options);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.contentService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @Request() req) {
    return this.contentService.update(+id, updateContentDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.contentService.remove(+id, req.user);
  }

  @Get(':id/history')
  getContentHistory(@Param('id') id: string, @Request() req) {
    return this.contentService.getContentHistory(+id, req.user);
  }

  @Get('history/user/:userId')
  @Roles(UserRole.ADMIN)
  getUserContentHistory(@Param('userId') userId: string, @Request() req) {
    return this.contentService.getUserContentHistory(+userId, req.user);
  }

  @Get('history/my')
  getMyContentHistory(@Request() req) {
    return this.contentService.getUserContentHistory(req.user.id, req.user);
  }
} 