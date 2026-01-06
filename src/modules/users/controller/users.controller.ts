import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { JwtAuthGuard, RolesGaurd  } from '../../../common/guards';
import { Roles, CurrentUser } from '../../../common/decorators';
import { UserRole } from '../../../common/enums';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGaurd )
  @Roles(UserRole.Admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGaurd )
  @Roles(UserRole.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.usersService.findOne({ where: { id } }, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}