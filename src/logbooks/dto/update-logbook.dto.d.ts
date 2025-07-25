import { CreateLogbookDto } from './create-logbook.dto';
declare const UpdateLogbookDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateLogbookDto>>;
export declare class UpdateLogbookDto extends UpdateLogbookDto_base {
    logDate?: string;
    content?: string;
    status?: string;
}
export {};
