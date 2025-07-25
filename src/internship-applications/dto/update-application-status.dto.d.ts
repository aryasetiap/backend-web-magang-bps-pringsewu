import { StatusInternship } from '@prisma/client';
export declare class UpdateApplicationStatusDto {
    status: StatusInternship;
    feedback?: string;
    startDate?: string;
    endDate?: string;
}
