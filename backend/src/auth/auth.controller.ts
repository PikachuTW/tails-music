import { Body, Controller, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';

interface ValidateCodeDto {
    code: number;
    discordId: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('getcode')
    async getCode(@Req() req: FastifyRequest) {
        return this.authService.generateCode(req.session);
    }
}
