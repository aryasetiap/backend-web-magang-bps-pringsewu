export declare enum CreatableRoles {
    STAFF_BPS = "Staff BPS",
    ADMIN = "Admin"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    roleName: CreatableRoles;
}
