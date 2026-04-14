import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    //private readonly mailService: EmailService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user);
      //await this.mailService.sendWelcomeEmail(user.email, user.name, 'Link de ejemplo')
      return {
        email: user.email,
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleDbError(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        id: true,
        password: true,
        name: true,
        lastname: true
      }
    });

    if (!user) throw new UnauthorizedException('Credenciales no son correctas (email)')

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales no son correctas (password)')

    return {
      email: user.email,
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      token: this.getJwtToken({ id: user.id })
    }
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token;
  }


  private handleDbError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail)
    console.log(error)
    throw new InternalServerErrorException('Please check log errors')
  }
}