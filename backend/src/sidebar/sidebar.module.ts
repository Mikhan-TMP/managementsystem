import { Module } from '@nestjs/common';
import { SidebarController } from './sidebar.controller';
import { SidebarService } from './sidebar.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        SupabaseModule,
        ConfigModule, // Required for SupabaseAuthGuard
    ],
    controllers: [SidebarController],
    providers: [SidebarService],
})
export class SidebarModule {}