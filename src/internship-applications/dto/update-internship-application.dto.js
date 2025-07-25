"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInternshipApplicationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_internship_application_dto_1 = require("./create-internship-application.dto");
class UpdateInternshipApplicationDto extends (0, mapped_types_1.PartialType)(create_internship_application_dto_1.CreateInternshipApplicationDto) {
}
exports.UpdateInternshipApplicationDto = UpdateInternshipApplicationDto;
//# sourceMappingURL=update-internship-application.dto.js.map