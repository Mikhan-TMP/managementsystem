import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('sidebar')
@UseGuards(SupabaseAuthGuard)
export class SidebarController {
    constructor(private readonly sidebarService: SidebarService) {}

    @Get('items')
    async getSidebarItems(@Request() req) {
        const userId = req.user.id;
        return this.sidebarService.getSidebarItemsByUserRole(userId);
    }
}