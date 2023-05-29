import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FindAllDto } from '../../common/find-all.dto';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { AtGuard } from '../auth/guards/at.guard';
import { Permissions } from '../../decorators/permissions.decorator';
import { Subject } from '../../decorators/subject.decorator';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AtGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(PermissionGuard)
    @Permissions('user:create')
    @Subject('user')
    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(@Query() findAllDto: FindAllDto) {
        return this.userService.findAll(findAllDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
