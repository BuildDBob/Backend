/*
AI Declaration:
I used Gemini to help debug the issues that arose such as imports being incorrect or using wrong variable names. I also used it to clarify some understandings. 
I wrote all the other code, and I understand the entire implementation.

Reflection:
I didn't fully understand how every file and service tied together, so I used AI to quickly answer my questions. I understand it clearer now. 
*/


import { Injectable,  ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(userDto: UserDto) {
        const {username, password, role} = userDto;

        const existingUser = await this.prisma.user.findFirst({
            where: { username },
        });

        if (existingUser) {
            throw new ConflictException('User with this username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: role || Role.USER
            },
        });

        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        }
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findFirst({where: {username}});
        if (user && (await bcrypt.compare(pass, user.password))){
            const { password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id, role: user.role};
        return  {
            access_token: this.jwtService.sign(payload),
        }
    }
}
