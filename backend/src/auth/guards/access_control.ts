import { SupabaseService } from '../../supabase/supabase.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AccessControlGuard {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getAccessControl(role_id: string) {
        // Fetch the access_control table data
        const { data: accessControlData, error: accessControlError } = await this.supabaseService.client
            .from('access_control')
            .select('*');

        if (accessControlError) {
            throw new Error(`Failed to fetch access control data: ${accessControlError.message}`);
        }

        //get the allowed_to array from the allowed_to column
        const allowedTo = accessControlData[0]?.allowed_to || [];
        //then look if the role_id is in the allowed_to array
        //then return the name of the access control where role_id is in the allowed_to array
        const matchingAccessControl = accessControlData.find(ac => 
            ac.allowed_to?.includes(role_id)
        );
    
        return matchingAccessControl?.name || null;
    }
}