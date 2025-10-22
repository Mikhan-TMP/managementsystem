import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AccessControlGuard } from '../auth/guards/access_control';
import { isEmpty } from 'rxjs';

@Injectable()
export class AttendanceService {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly accessControlGuard: AccessControlGuard
    ) {}

    async getAllAttendance(user: any) {
        // Get the current user's role_id and access control name
        const roleId = user.user_metadata?.role_id;
        let accessControlName = null;
        if (roleId) {
            accessControlName = await this.accessControlGuard.getAccessControl(roleId);
            console.log('Access Control Name:', accessControlName);
        } else {
            console.log('No role_id found for user');
        }

        let data;
        let error;
        if (accessControlName === "Users") {
            // Regular users can only see their own attendance records
            ({ data, error } = await this.supabaseService.client
                .from('attendance_table')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .order('time_in', { ascending: false }));
            if (error) {
                throw new Error(`Failed to fetch attendance: ${error.message}`);
            }
        }
        else if (accessControlName === "Administrator" || accessControlName === "Moderator") {
            // Admins and other roles can see all attendance records
            ({ data, error } = await this.supabaseService.client
            .from('attendance_table')
            .select('*')
            .order('date', { ascending: false })
            .order('time_in', { ascending: false }));
            if (error) {
                throw new Error(`Failed to fetch attendance: ${error.message}`);
            }
        }
        else{
            throw new NotFoundException('Access control not found or unauthorized');
            return data = null;
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

    async submitTimeEntry(user: any, timeData: { time: string, remarks?: string }) {
        const supabase = this.supabaseService.client;
        const today = new Date().toISOString().split('T')[0];

        try {
            // Get user's department_id from metadata
            const departmentId = user.user_metadata?.department_id;

            
            if (!departmentId) {
                return {
                    success: false,
                    message: 'User department not found',
                    type: 'error',
                    data: null
                };
            }

            // Fetch office hours for the department
            const { data: officeHours, error: officeHoursError } = await supabase
                .from('office_hours')
                .select('time_start, time_end')
                .eq('department_id', departmentId)
                .single();

            if (officeHoursError || !officeHours) {
                throw new Error('Office hours not found for department');
            }

            // Check if user has an attendance record for today
            const { data: existing, error: checkError } = await supabase
                .from('attendance_table')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', today)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                // PGRST116 = no rows found, which is expected
                return {
                    success: false,
                    message: `Failed to check attendance: ${checkError.message}`,
                    type: 'error',
                    data: null
                };
            }

            // Check if both time_in and time_out already exist FIRST
            if (existing && existing.time_in && existing.time_out) {
                return {
                    success: false,
                    message: 'You have already completed your attendance for today (Time In and Time Out recorded)',
                    type: 'completed',
                    data: existing
                };
            }

            if (!existing) {
                // No record exists - create new TIME IN entry
                // Determine status based on time_in compared to office hours
                let status = 'present';
                
                // Compare time strings (format: HH:MM:SS or HH:MM)
                const timeIn = timeData.time;
                const timeStart = officeHours.time_start;
                const timeEnd = officeHours.time_end;

                // Check if time_in is after time_end (invalid/absent)
                if (timeIn > timeEnd) {
                    status = 'absent';
                } 
                // Check if time_in is after time_start (late)
                else if (timeIn > timeStart) {
                    status = 'late';
                }
                // Otherwise, time_in is before or equal to time_start (present)
                else {
                    status = 'present';
                }

                const { data, error } = await supabase
                    .from('attendance_table')
                    .insert([{
                        user_id: user.id,
                        date: today,
                        time_in: timeData.time,
                        status: status,
                        remarks: timeData.remarks || null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (error) {
                    return {
                        success: false,
                        message: `Failed to record time in: ${error.message}`,
                        type: 'error',
                        data: null
                    };
                }

                return {
                    success: true,
                    message: `Time in recorded successfully (${status})`,
                    type: 'time_in',
                    status: status,
                    data
                };
            } else if (existing.time_in && !existing.time_out) {
                console.log('Existing record:', existing);
                console.log('New time_out value:', timeData.time);
                
                // Record exists with time_in but no time_out - UPDATE with TIME OUT
                const { data, error } = await supabase
                    .from('attendance_table')
                    .update({
                        time_out: timeData.time,
                        remarks: timeData.remarks || existing.remarks,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();
    
                console.log('Updated record:', data);

                if (error) {
                    return {
                        success: false,
                        message: `Failed to record time out: ${error.message}`,
                        type: 'error',
                        data: null
                    };
                }

                return {
                    success: true,
                    message: 'Time out recorded successfully',
                    type: 'time_out',
                    data
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to process time entry',
                type: 'error',
                data: null
            };
        }
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