import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createUser(dto: CreateUserDto) {
    const { firstName, lastName, username, email, password, roleId, departmentId } = dto;
    // Create user in Supabase Auth with all info in metadata
    const { data: authData, error: authError } =
      await this.supabaseService.client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          username,
          role_id: roleId,
          department_id: departmentId, // Add this
          full_name: `${firstName} ${lastName}`,
          status: 'active',
        },
      });

    if (authError) throw authError;
    if (!authData?.user) throw new Error('Auth user creation failed');

    return {
      id: authData.user.id,
      email: authData.user.email,
      username,
      firstName,
      lastName,
      roleId,
      departmentId,
    };
  }

  async deleteUser(userId: string) {
    const { error } = await this.supabaseService.client.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    return { message: 'User deleted successfully' };
  }

  async getUser(userId: string) {
    const { data, error } = await this.supabaseService.client.auth.admin.getUserById(userId);
    if (error) throw error;

    return {
      id: data.user.id,
      email: data.user.email,
      ...data.user.user_metadata,
    };
  }

  async updateUser(userId: string, dto: any) {
    const { first_name, last_name, username, email, role_id, department_id } = dto;
    const { data, error } = await this.supabaseService.client.auth.admin.updateUserById(userId, {
      email,
      user_metadata: {
        first_name,
        last_name,
        username,
        role_id,
        department_id,
        full_name: `${first_name} ${last_name}`,
      },
    });

    if (error) throw error;

    return {
      id: data.user.id,
      email: data.user.email,
      ...data.user.user_metadata,
    };
  }

  async getAllUsers() {
    const { data, error } = await this.supabaseService.client.auth.admin.listUsers();
    
    if (error) throw error;

    // Fetch all roles from the database
    const { data: roles, error: rolesError } = await this.supabaseService.client
      .from('roles_table')
      .select('id, name');
    
    if (rolesError) throw rolesError;

    // Create a map for quick role lookup
    const rolesMap = new Map(roles.map(role => [role.id, role.name]));


    // Fetch department names for users
    const { data: departments, error: departmentsError } = await this.supabaseService.client
      .from('departments_table')
      .select('id, department_name');

    if (departmentsError) throw departmentsError;

    // Create a map for quick department lookup
    const departmentsMap = new Map(departments.map(department => [department.id, department.department_name]));

    return data.users.map(user => ({
      id: user.id,
      email: user.email,
      user_metadata: {
        ...user.user_metadata,
        role_name: user.user_metadata?.role_id 
          ? rolesMap.get(user.user_metadata.role_id) 
          : null,
        department_name: user.user_metadata?.department_id
          ? departmentsMap.get(user.user_metadata.department_id)
          : null,
      },
      created_at: user.created_at,
    }));
  }

  async getRoles(departmentId: string) {
    console.log('Fetching roles for departmentId:', departmentId);
    
    if (!departmentId) {
      throw new Error('Department ID is required');
    }
    
    const { data, error } = await this.supabaseService
      .client
      .from('roles_table')
      .select('id, name, department_id')
      .order('name');
      
    if (error) {
      throw new Error(`Failed to fetch roles: ${error.message}`);
    }
    
    // Filter in code since the database column is text, not array
    const filtered = data.filter(role => {
      try {
        const deptIds = JSON.parse(role.department_id);
        return deptIds.includes(departmentId);
      } catch {
        return false;
      }
    });
    
    return filtered;
  }

  async getDepartments() {
    const { data, error } = await this.supabaseService
      .client
      .from('departments_table') 
      .select('id, department_name')
      .order('department_name');
    if (error) {
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }
    return data;
  }
}
