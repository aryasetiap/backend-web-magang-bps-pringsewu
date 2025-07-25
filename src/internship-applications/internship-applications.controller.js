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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternshipApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const internship_applications_service_1 = require("./internship-applications.service");
const create_internship_application_dto_1 = require("./dto/create-internship-application.dto");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const update_application_status_dto_1 = require("./dto/update-application-status.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
let InternshipApplicationsController = class InternshipApplicationsController {
    internshipApplicationsService;
    constructor(internshipApplicationsService) {
        this.internshipApplicationsService = internshipApplicationsService;
    }
    create(files, req, createInternshipApplicationDto) {
        const userId = req.user.userId;
        return this.internshipApplicationsService.create(userId, createInternshipApplicationDto, files);
    }
    findAll(paginationQuery) {
        return this.internshipApplicationsService.findAll(paginationQuery);
    }
    async getMyApplication(req) {
        const userId = req.user.userId;
        return {
            data: await this.internshipApplicationsService.findByUser(userId),
        };
    }
    findOne(id) {
        return this.internshipApplicationsService.findOne(+id);
    }
    updateStatus(id, updateApplicationStatusDto, req) {
        const adminId = req.user.userId;
        return this.internshipApplicationsService.updateStatus(+id, adminId, updateApplicationStatusDto);
    }
};
exports.InternshipApplicationsController = InternshipApplicationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cv', maxCount: 1 },
        { name: 'transcript', maxCount: 1 },
        { name: 'requestLetter', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_internship_application_dto_1.CreateInternshipApplicationDto]),
    __metadata("design:returntype", void 0)
], InternshipApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], InternshipApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Intern'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InternshipApplicationsController.prototype, "getMyApplication", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InternshipApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_status_dto_1.UpdateApplicationStatusDto, Object]),
    __metadata("design:returntype", void 0)
], InternshipApplicationsController.prototype, "updateStatus", null);
exports.InternshipApplicationsController = InternshipApplicationsController = __decorate([
    (0, common_1.Controller)('internship-applications'),
    __metadata("design:paramtypes", [internship_applications_service_1.InternshipApplicationsService])
], InternshipApplicationsController);
//# sourceMappingURL=internship-applications.controller.js.map