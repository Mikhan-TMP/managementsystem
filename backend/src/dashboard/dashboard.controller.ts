import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('dashboard')
@UseGuards(SupabaseAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    async getDashboardStats(@Request() req) {
        return this.dashboardService.getDashboardStats();
    }
}