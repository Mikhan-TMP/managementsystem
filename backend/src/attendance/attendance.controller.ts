import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('attendance')
@UseGuards(SupabaseAuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @Get()
    async getAllAttendance(@Request() req) {
        return this.attendanceService.getAllAttendance(req.user);
    }

    @Post('submit-time')
    async submitTimeEntry(@Request() req, @Body() body: { time: string, remarks?: string }) {
        return this.attendanceService.submitTimeEntry(req.user, body);
    }

    // @Get(':id')
    // async getAttendanceById(@Param('id') id: string) {
    //     return this.attendanceService.getAttendanceById(id);
    // }

    // @Get('user/:userId')
    // async getAttendanceByUserId(@Param('userId') userId: string) {
    //     return this.attendanceService.getAttendanceByUserId(userId);
    // }

    // @Get('date/:date')
    // async getAttendanceByDate(@Param('date') date: string) {
    //     return this.attendanceService.getAttendanceByDate(date);
    // }

    // @Post()
    // async createAttendance(@Body() attendanceData: any) {
    //     return this.attendanceService.createAttendance(attendanceData);
    // }

    // @Post('check-in')
    // async checkIn(@Body() body: { user_id: string }) {
    //     return this.attendanceService.checkIn(body.user_id);
    // }

    // @Put('check-out/:id')
    // async checkOut(@Param('id') id: string) {
    //     return this.attendanceService.checkOut(id);
    // }

    // @Put(':id')
    // async updateAttendance(@Param('id') id: string, @Body() attendanceData: any) {
    //     return this.attendanceService.updateAttendance(id, attendanceData);
    // }

    // @Delete(':id')
    // async deleteAttendance(@Param('id') id: string) {
    //     return this.attendanceService.deleteAttendance(id);
    // }
}