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
exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateProfileDto {
    name;
    namaLengkap;
    nimNisn;
    asalInstitusi;
    jurusanProdi;
    nomorTelepon;
    alamat;
    educationStatus;
    activityType;
    activityStart;
    activityEnd;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nama user',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Nama harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nama lengkap user',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Nama lengkap harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "namaLengkap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'NIM/NISN user',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'NIM/NISN harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "nimNisn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asal institusi user',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Asal institusi harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "asalInstitusi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Jurusan/Program Studi user',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Jurusan/Prodi harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "jurusanProdi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nomor telepon user',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Nomor telepon harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "nomorTelepon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alamat user',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Alamat harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "alamat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status pendidikan',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Status pendidikan harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "educationStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Jenis kegiatan',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Jenis kegiatan harus berupa teks' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "activityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tanggal mulai kegiatan',
        required: false,
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateProfileDto.prototype, "activityStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tanggal selesai kegiatan',
        required: false,
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateProfileDto.prototype, "activityEnd", void 0);
//# sourceMappingURL=update-profile.dto.js.map