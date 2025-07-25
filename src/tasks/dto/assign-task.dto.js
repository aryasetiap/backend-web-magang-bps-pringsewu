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
exports.AssignTaskDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AssignTaskDto {
    internIds;
}
exports.AssignTaskDto = AssignTaskDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (Array.isArray(value)) {
            return value.map(Number);
        }
        if (typeof value === 'string') {
            if (value.includes(',')) {
                return value.split(',').map((v) => Number(v.trim()));
            }
            return [Number(value)];
        }
        return [];
    }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Pilih setidaknya satu intern untuk ditugaskan.' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Setiap ID intern harus berupa angka.' }),
    __metadata("design:type", Array)
], AssignTaskDto.prototype, "internIds", void 0);
//# sourceMappingURL=assign-task.dto.js.map