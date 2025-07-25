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
exports.LogbooksController = void 0;
const common_1 = require("@nestjs/common");
const logbooks_service_1 = require("./logbooks.service");
const create_logbook_dto_1 = require("./dto/create-logbook.dto");
const update_logbook_dto_1 = require("./dto/update-logbook.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let LogbooksController = class LogbooksController {
    logbooksService;
    constructor(logbooksService) {
        this.logbooksService = logbooksService;
    }
    create(req, createLogbookDto) {
        const userId = req.user.userId;
        return this.logbooksService.create(userId, createLogbookDto);
    }
    findAll(req) {
        const userId = req.user.userId;
        return this.logbooksService.findAll(userId);
    }
    async getAllLogbooks(page = 1, limit = 20) {
        return this.logbooksService.findAllForAdmin(Number(page), Number(limit));
    }
    findOne(req, id) {
        const userId = req.user.userId;
        return this.logbooksService.findOne(userId, id);
    }
    update(req, id, updateLogbookDto) {
        const userId = req.user.userId;
        return this.logbooksService.update(userId, id, updateLogbookDto);
    }
    remove(req, id) {
        const userId = req.user.userId;
        return this.logbooksService.remove(userId, id);
    }
    async exportUserLogbookReport(userId, startDate, endDate, req, res) {
        const adminName = req.user?.name || 'Admin';
        const pdfBuffer = await this.logbooksService.exportUserLogbookReport(userId, { startDate, endDate }, adminName);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="logbook-intern-${userId}.pdf"`,
        });
        res.end(pdfBuffer);
    }
};
exports.LogbooksController = LogbooksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_logbook_dto_1.CreateLogbookDto]),
    __metadata("design:returntype", void 0)
], LogbooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogbooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LogbooksController.prototype, "getAllLogbooks", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], LogbooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_logbook_dto_1.UpdateLogbookDto]),
    __metadata("design:returntype", void 0)
], LogbooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], LogbooksController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':userId/report'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], LogbooksController.prototype, "exportUserLogbookReport", null);
exports.LogbooksController = LogbooksController = __decorate([
    (0, common_1.Controller)('logbooks'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [logbooks_service_1.LogbooksService])
], LogbooksController);
//# sourceMappingURL=logbooks.controller.js.map