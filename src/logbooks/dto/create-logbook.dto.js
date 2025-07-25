"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogbookDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLogbookDto {
    logDate;
    content;
}
exports.CreateLogbookDto = CreateLogbookDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tanggal log tidak boleh kosong.' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Format tanggal harus YYYY-MM-DD.' }),
    __metadata("design:type", String)
], CreateLogbookDto.prototype, "logDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Isi kegiatan tidak boleh kosong.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Isi kegiatan minimal harus 10 karakter.' }),
    __metadata("design:type", String)
], CreateLogbookDto.prototype, "content", void 0);
//# sourceMappingURL=create-logbook.dto.js.map