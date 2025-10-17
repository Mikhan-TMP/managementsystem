import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SidebarService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getSidebarItemsByUserRole(userId: string) {
        try {
            console.log(`Fetching sidebar items for user: ${userId}`);

            // Step 1: Get user's role_id from user metadata
            const { data: { user }, error: userError } = await this.supabaseService
                .client
                .auth
                .admin
                .getUserById(userId);

            if (userError || !user) {
                throw new Error(`Failed to fetch user: ${userError?.message}`);
            }

            // Get role_id from user metadata and ensure it's an integer
            const roleId = user.user_metadata?.role_id;

            if (!roleId) {
                console.warn(`User ${userId} has no role_id in metadata`);
                throw new NotFoundException('User role not found');
            }

            // Convert roleId to integer if it's a string
            // const roleIdInt = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;

            console.log(`User ${userId} has role_id: ${roleId}`);

            // Step 2: Use RPC or filter to check if roleId is in user_access array
            const { data: sidebarItems, error: sidebarError } = await this.supabaseService
                .client
                .from('sidebar_items')
                .select('*')
                .filter('user_access', 'cs', `{${roleId}}`) 
                .order('id', { ascending: true });

            if (sidebarError) {
                console.error('Supabase error:', sidebarError);
                throw new Error(`Failed to fetch sidebar items: ${sidebarError.message}`);
            }

            // console.log(`Found ${sidebarItems?.length || 0} sidebar items for role ${roleIdInt}`);

            // Step 3: Transform data to match frontend expectations
            return sidebarItems.map(item => ({
                id: item.id,
                name: item.name,
                // href: this.generateHref(item.name),
                icon: item.icon || null,
                userAccess: item.user_access,
                createdAt: item.created_at,
            }));
        } catch (error) {
            console.error('Error in getSidebarItemsByUserRole:', error);
            throw error;
        }
    }

    // Helper function to generate routes from menu names
    // private generateHref(name: string): string {
    //     const routeMap: { [key: string]: string } = {
    //         'Dashboard': '/pages/dashboard',
    //         'Users': '/pages/users',
    //         'Projects': '/pages/projects',
    //         'Attendance': '/pages/attendance',
    //         'Documentation': '/pages/documentation',
    //         'Reports/Analytics': '/pages/reports',
    //         'Calendar': '/pages/calendar',
    //         'Communication': '/pages/communication',
    //         'Settings': '/pages/settings',
    //         'Access Control': '/pages/access-control',
    //     };

    //     return routeMap[name] || `/pages/${name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`;
    // }
}