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
exports.FinalProjectsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const final_projects_service_1 = require("./final-projects.service");
const create_final_project_dto_1 = require("./dto/create-final-project.dto");
const update_final_project_dto_1 = require("./dto/update-final-project.dto");
const review_final_project_dto_1 = require("./dto/review-final-project.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
let FinalProjectsController = class FinalProjectsController {
    finalProjectsService;
    constructor(finalProjectsService) {
        this.finalProjectsService = finalProjectsService;
    }
    create(req, createFinalProjectDto, file) {
        const userId = req.user.userId;
        return this.finalProjectsService.create(userId, createFinalProjectDto, file);
    }
    findAllForUser(req) {
        const userId = req.user.userId;
        return this.finalProjectsService.findAllForUser(userId);
    }
    findAllForAdmin(query) {
        return this.finalProjectsService.findAllForAdmin(query.page, query.limit);
    }
    findOne(id, req) {
        const userId = req.user.userId;
        const userRole = req.user.role;
        return this.finalProjectsService.findOne(id, userRole === 'admin' ? undefined : userId);
    }
    update(id, req, updateFinalProjectDto, file) {
        const userId = req.user.userId;
        return this.finalProjectsService.update(id, userId, updateFinalProjectDto, file);
    }
    review(id, req, reviewDto) {
        const reviewerId = req.user.userId;
        return this.finalProjectsService.review(id, reviewerId, reviewDto);
    }
    remove(id, req) {
        const userId = req.user.userId;
        return this.finalProjectsService.remove(id, userId);
    }
};
exports.FinalProjectsController = FinalProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Intern'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_final_project_dto_1.CreateFinalProjectDto, Object]),
    __metadata("design:returntype", void 0)
], FinalProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('Intern'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinalProjectsController.prototype, "findAllForUser", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], FinalProjectsController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FinalProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('Intern'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_final_project_dto_1.UpdateFinalProjectDto, Object]),
    __metadata("design:returntype", void 0)
], FinalProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, review_final_project_dto_1.ReviewFinalProjectDto]),
    __metadata("design:returntype", void 0)
], FinalProjectsController.prototype, "review", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Intern'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FinalProjectsController.prototype, "remove", null);
exports.FinalProjectsController = FinalProjectsController = __decorate([
    (0, common_1.Controller)('final-projects'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [final_projects_service_1.FinalProjectsService])
], FinalProjectsController);
//# sourceMappingURL=final-projects.controller.js.map