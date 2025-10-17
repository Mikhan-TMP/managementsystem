import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AttendanceService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getAllAttendance() {
        const { data, error } = await this.supabaseService.client
            .from('attendance_table')
            .select('*')
            .order('date', { ascending: false })
            .order('time_in', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch attendance: ${error.message}`);
        }
        
        // Use admin client to access auth.users
        for (const record of data) {
            const { data: userData, error: userError } = await this.supabaseService.client.auth.admin
                .getUserById(record.user_id);
                
            if (userError) {
                throw new Error(`Failed to fetch user data: ${userError.message}`);
            }
            record['user_name'] = userData.user.user_metadata?.full_name || 'Unknown';
        }

        return data;
    }

    // async getAttendanceById(id: string) {
    //     const supabase = this.supabaseService.getClient();
    //     const { data, error } = await supabase
    //         .from('attendance')
    //         .select('*')
    //         .eq('id', id)
    //         .single();

    //     if (error) {
    //         throw new NotFoundException(`Attendance with ID ${id} not found`);
    //     }

    //     return data;
    // }

    // async getAttendanceByUserId(userId: string) {
    //     const supabase = this.supabaseService.getClient();
    //     const { data, error } = await supabase
    //         .from('attendance')
    //         .select('*')
    //         .eq('user_id', userId)
    //         .order('date', { ascending: false });

    //     if (error) {
    //         throw new Error(`Failed to fetch attendance for user: ${error.message}`);
    //     }

    //     return data;
    // }

    // async getAttendanceByDate(date: string) {
    //     const supabase = this.supabaseService.getClient();
    //     const { data, error } = await supabase
    //         .from('attendance')
    //         .select('*')
    //         .eq('date', date);

    //     if (error) {
    //         throw new Error(`Failed to fetch attendance for date: ${error.message}`);
    //     }

    //     return data;
    // }

    // async createAttendance(attendanceData: any) {
    //     const supabase = this.supabaseService.getClient();
    //     const { data, error } = await supabase
    //         .from('attendance')
    //         .insert([attendanceData])
    //         .select()
    //         .single();

    //     if (error) {
    //         throw new Error(`Failed to create attendance: ${error.message}`);
    //     }

    //     return data;
    // }

    // async checkIn(userId: string) {
    //     const supabase = this.supabaseService.getClient();
    //     const today = new Date().toISOString().split('T')[0];

    //     // Check if user already checked in today
    //     const { data: existing } = await supabase
    //         .from('attendance')
    //         .select('*')
    //         .eq('user_id', userId)
    //         .eq('date', today)
    //         .single();

    //     if (existing) {
    //         throw new Error('Already checked in today');
    //     }

    //     const { data, error } = await supabase
    //         .from('attendance')
    //         .insert([{
    //             user_id: userId,
    //             date: today,
    //             time_in: new Date().toISOString(),
    //             status: 'present'
    //         }])
    //         .select()
    //         .single();

    //     if (error) {
    //         throw new Error(`Failed to check in: ${error.message}`);
    //     }

    //     return data;
    // }

    // async checkOut(id: string) {
    //     const supabase = this.supabaseService.getClient();
    //     const { data, error } = await supabase
    //         .from('attendance')
    //         .update({ 
    //             time_out: new Date().toISOString(),
    //             updated_at: new Date().toISOString()
    //         })
    //         .eq('id', id)
    //         .select()
    //         .single();

    //     if (error) {
    //         throw new Error(`Failed to check out: ${error.message}`);
    //     }

    //     return data;
    // }

    // async updateAttendance(id: string, attendanceData: any) {
    //     const supabase = this.supabaseService.getClient();
    //     const { data, error } = await supabase
    //         .from('attendance')
    //         .update({ 
    //             ...attendanceData,
    //             updated_at: new Date().toISOString()
    //         })
    //         .eq('id', id)
    //         .select()
    //         .single();

    //     if (error) {
    //         throw new NotFoundException(`Failed to update attendance: ${error.message}`);
    //     }

    //     return data;
    // }

    // async deleteAttendance(id: string) {
    //     const supabase = this.supabaseService.getClient();
    //     const { error } = await supabase
    //         .from('attendance')
    //         .delete()
    //         .eq('id', id);

    //     if (error) {
    //         throw new Error(`Failed to delete attendance: ${error.message}`);
    //     }

    //     return { message: 'Attendance deleted successfully' };
    // }
}