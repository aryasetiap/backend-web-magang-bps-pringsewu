export declare enum LeaveType {
    sakit = "sakit",
    izin = "izin"
}
export declare class RequestLeaveDto {
    type: LeaveType;
    description: string;
}
