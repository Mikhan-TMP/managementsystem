import { Controller, Post, Body, Headers, UnauthorizedException, Get, Delete, Param, UseGuards, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto, @Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No token provided');

    const decoded: any = jwt.decode(token);
    // console.log('Decoded token:', decoded);
    
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    // Check role from user_metadata or app_metadata
    // const userRole = decoded.user_metadata?.role_id || decoded.app_metadata?.role;
    // console.log('User role:', userRole);
    
    // For now, allow any authenticated user to create users
    // Later, you can check against your roles_tbl
    // if (userRole !== 1) { // assuming 1 is admin role_id
    //   throw new UnauthorizedException('Not authorized');
    // }

    return this.usersService.createUser(dto);
  }
  @Get()
  @UseGuards(SupabaseAuthGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('roles')
  async getRoles(@Query('departmentId') departmentId: string) {
    return this.usersService.getRoles(departmentId);
  }

  @Get(':id')
  @UseGuards(SupabaseAuthGuard)
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Put(':id')
  @UseGuards(SupabaseAuthGuard)
  async updateUser(@Param('id') id: string, @Body() dto: any) {
    return this.usersService.updateUser(id, dto);
  }

  @Get('departments/list')
  @UseGuards(SupabaseAuthGuard)
  async getDepartments(){
    return this.usersService.getDepartments();
  }

}


