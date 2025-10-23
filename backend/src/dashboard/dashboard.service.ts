import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DashboardService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getDashboardStats() {
        const supabase = this.supabaseService.client;

        try {
            // Get total users count
            const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
            if (usersError) throw new Error(`Failed to fetch users: ${usersError.message}`);
            const totalUsers = usersData.users.length;

            // Get total departments count
            const { count: totalDepartments, error: depError } = await supabase
                .from('departments')
                .select('*', { count: 'exact', head: true });
            if (depError) throw new Error(`Failed to fetch departments: ${depError.message}`);

            // Get attendance for last 6 days
            const last6Days = this.getLast6Days();
            const attendanceByDay = await Promise.all(
                last6Days.map(async (date) => {
                    const { count, error } = await supabase
                        .from('attendance_table')
                        .select('*', { count: 'exact', head: true })
                        .eq('date', date);
                    
                    if (error) throw new Error(`Failed to fetch attendance: ${error.message}`);
                    
                    return {
                        date,
                        count: count || 0
                    };
                })
            );

            // Get today's attendance rate
            const today = new Date().toISOString().split('T')[0];
            const { count: todayAttendance, error: todayError } = await supabase
                .from('attendance_table')
                .select('*', { count: 'exact', head: true })
                .eq('date', today);
            
            if (todayError) throw new Error(`Failed to fetch today's attendance: ${todayError.message}`);

            const attendanceRate = totalUsers > 0 
                ? ((todayAttendance || 0) / totalUsers * 100).toFixed(2) 
                : 0;

            // Get employment overview (users added per month for last 12 months)
            const employmentOverview = await this.getEmploymentOverview();

            return {
                totalUsers,
                totalDepartments: totalDepartments || 0,
                attendanceByDay,
                attendanceRate: parseFloat(attendanceRate as string),
                todayAttendance: todayAttendance || 0,
                employmentOverview
            };
        } catch (error) {
            throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
        }
    }

    private getLast6Days(): string[] {
        const dates: string[] = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    }

    private async getEmploymentOverview() {
        const supabase = this.supabaseService.client;
        
        // Get all users with their created_at timestamp
        const { data: users, error } = await supabase.auth.admin.listUsers();
        
        if (error) throw new Error(`Failed to fetch users for employment overview: ${error.message}`);

        // Group users by month for last 12 months
        const last12Months = this.getLast12Months();
        const employmentData = last12Months.map(monthKey => {
            const usersInMonth = users.users.filter(user => {
                const userMonth = new Date(user.created_at).toISOString().slice(0, 7);
                return userMonth === monthKey;
            });

            return {
                month: this.formatMonth(monthKey),
                count: usersInMonth.length
            };
        });

        return employmentData;
    }

    private getLast12Months(): string[] {
        const months: string[] = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toISOString().slice(0, 7)); // Format: YYYY-MM
        }
        return months;
    }

    private formatMonth(monthKey: string): string {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
}