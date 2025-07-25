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
exports.RequestLeaveDto = exports.LeaveType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var LeaveType;
(function (LeaveType) {
    LeaveType["sakit"] = "sakit";
    LeaveType["izin"] = "izin";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
class RequestLeaveDto {
    type;
    description;
}
exports.RequestLeaveDto = RequestLeaveDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: LeaveType, description: 'Jenis pengajuan: sakit/izin' }),
    (0, class_validator_1.IsEnum)(LeaveType, { message: 'Jenis pengajuan harus sakit atau izin' }),
    __metadata("design:type", String)
], RequestLeaveDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deskripsi alasan tidak hadir' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Deskripsi alasan wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestLeaveDto.prototype, "description", void 0);
//# sourceMappingURL=request-leave.dto.js.map