import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Pagination } from '../../interfaces/pagination.interface';
import { ResponseData } from '../../interfaces/response.interface';
import { LoginDto } from '../auth/dto/login.dto';
import { Hash } from '../../common/hash';
import { FindAllDto } from '../../common/find-all.dto';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOneBy({ email });
    }

    async login(loginDto: LoginDto): Promise<User> {
        const user = await this.findOneByEmail(loginDto.email);
        if (!user) {
            return null;
        }
        const isMatch = await Hash.compare(loginDto.password, user.password);
        if (!isMatch) {
            return null;
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<ResponseData<User>> {
        const { email, password, name } = createUserDto;

        // Kiểm tra xem email đã tồn tại hay chưa
        const existingUser = await this.findOneByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Tạo mới đối tượng người dùng
        const newUser = this.userRepository.create(createUserDto);

        // Mã hóa mật khẩu

        newUser.password = await Hash.hash(password);

        // Lưu đối tượng người dùng vào cơ sở dữ liệu
        const savedUser = await this.userRepository.save(newUser);
        delete savedUser.password;
        // Chuẩn bị dữ liệu phản hồi (response data)
        return {
            data: savedUser,
            message: 'User created successfully',
            statusCode: HttpStatus.CREATED,
        };
    }

    async getCount(): Promise<number> {
        return this.userRepository.count();
    }
    getNameTable(): string {
        return this.userRepository.metadata.tableName;
    }

    async findAll(findAllDto: FindAllDto): Promise<Pagination<User>> {
        const { page = 1, limit = 10, sort, order, search } = findAllDto;
        const nameTable = this.getNameTable();
        const query = this.userRepository.createQueryBuilder(nameTable);

        if (search) {
            query.where(
                new Brackets((qb) => {
                    qb.where(`${nameTable}.name LIKE :search`, { search: `%${search}%` }).orWhere(
                        `${nameTable}.email LIKE :search`,
                        { search: `%${search}%` },
                    );
                }),
            );
        }

        const totalCount = await this.getCount();

        if (sort && order) {
            query.orderBy(`user.${sort}`, order);
        }

        if (page) {
            query.skip((page - 1) * limit);
            query.take(limit);
        }
        query.select(['user.id', 'user.name', 'user.email', 'user.createdAt', 'user.updatedAt']);
        query.leftJoinAndSelect('user.roles', 'roles');
        const users = await query.getMany();

        return {
            data: users,
            currentPage: page,
            perPage: limit,
            count: users.length,
            totalPage: Math.ceil(totalCount / limit),
            total: totalCount,
        };
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id }, select: { password: false } });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        if (updateUserDto.password) {
            updateUserDto.password = await Hash.hash(updateUserDto.password);
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findOneByEmail(updateUserDto.email);

            if (existingUser) {
                throw new ConflictException('Email already exists');
            }
        }

        await this.userRepository.update(id, updateUserDto);

        return this.findOne(id);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.remove(user);
        return user;
    }

    async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return await this.userRepository.save({ ...user, refreshToken });
    }

    async validateUser(payload: JwtPayload): Promise<User> {
        return await this.findOne(+payload.sub);
    }

    async getPermissions(id: number): Promise<string[]> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { roles: { permissions: true } },
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const permissions: Set<string> = new Set();
        user.roles.forEach((role) => {
            role.permissions.forEach((permission) => {
                permissions.add(permission.slug);
            });
        });
        return [...permissions];
    }
}
