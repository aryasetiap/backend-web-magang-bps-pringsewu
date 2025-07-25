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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const assign_task_dto_1 = require("./dto/assign-task.dto");
const platform_express_1 = require("@nestjs/platform-express");
const grade_submission_dto_1 = require("../submissions/dto/grade-submission.dto");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(req, createTaskDto, file) {
        const creatorId = req.user.userId;
        return this.tasksService.create(creatorId, createTaskDto, file);
    }
    assignTask(id, assignTaskDto) {
        return this.tasksService.assignTask(id, assignTaskDto);
    }
    async submitTask(taskId, req, file, description) {
        const userId = req.user.userId;
        return this.tasksService.submitTask(userId, taskId, file, description);
    }
    findSubmissionsForTask(taskId) {
        return this.tasksService.findSubmissionsForTask(taskId);
    }
    gradeSubmission(submissionId, gradeSubmissionDto, req) {
        const graderId = req.user.userId;
        return this.tasksService.gradeSubmission(submissionId, gradeSubmissionDto, graderId);
    }
    findMyTasks(req) {
        const userId = req.user.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        return this.tasksService.findTasksForUser(userId, page, limit);
    }
    findAll() {
        return this.tasksService.findAll();
    }
    async findOne(id, req) {
        const user = req.user;
        const task = await this.tasksService.findOne(id);
        if (user.role === 'Intern') {
            const assigned = await this.tasksService.isUserAssignedToTask(id, user.userId);
            if (!assigned) {
                throw new common_1.ForbiddenException('Anda tidak berhak mengakses tugas ini.');
            }
        }
        return task;
    }
    update(id, updateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }
    remove(id) {
        return this.tasksService.remove(id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, assign_task_dto_1.AssignTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "assignTask", null);
__decorate([
    (0, common_1.Post)(':id/submissions'),
    (0, roles_decorator_1.Roles)('Intern'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('submissionFile')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "submitTask", null);
__decorate([
    (0, common_1.Get)(':id/submissions'),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findSubmissionsForTask", null);
__decorate([
    (0, common_1.Patch)('submissions/:submissionId/grade'),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('submissionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, grade_submission_dto_1.GradeSubmissionDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "gradeSubmission", null);
__decorate([
    (0, common_1.Get)('my-tasks'),
    (0, roles_decorator_1.Roles)('Intern'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findMyTasks", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS', 'Intern'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Staff BPS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map