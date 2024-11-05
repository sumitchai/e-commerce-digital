import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    let result = {};
    if (createUserDto.password !== createUserDto.confirm_password) {

        result = {
            status: false,
            message: 'password not confirm'
        }

        return result;

    } else {
        const register = await this.usersRepository.create(createUserDto)
        const toCreate = await this.usersRepository.save(register)

        let user = {
            id: toCreate.id,
            username: toCreate.username,
            name: toCreate.name,
            created_at: toCreate.created_at,
            updated_at: toCreate.updated_at,
            deleted_at: toCreate.deleted_at
        }

        result = {
            status: true,
            message: 'success',
            result: {
              user: user
            }
        }

        return result;
    }
}

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const getUser = await this.usersRepository.findOneBy({ id: id })

    let user = {
      id: getUser.id,
      username: getUser.username,
      name: getUser.name,
      created_at: getUser.created_at,
      updated_at: getUser.updated_at,
      deleted_at: getUser.deleted_at
    }

    let result = {
      status: true,
      message: 'success',
      user: user
    }

    return result;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  findByUserName(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
