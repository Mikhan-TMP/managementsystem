import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { AccessControlGuard } from 'src/auth/guards/access_control';

@Module({
    imports: [
        SupabaseModule,
        ConfigModule,
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService, AccessControlGuard],
    exports: [AttendanceService],
})
export class AttendanceModule {}