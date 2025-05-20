import { ForbiddenException, Injectable } from '@nestjs/common';
import { Collection } from 'discord.js';
import * as secureSession from '@fastify/secure-session';

interface CodeData {
    expiresAt: number;
    session: secureSession.Session<{
        discordid?: string;
    }>;
}

@Injectable()
export class AuthService {
    public codes: Collection<number, CodeData> = new Collection();
    private readonly codeTimeout: number = 1000 * 60 * 5;

    generateCode(session: secureSession.Session) {
        const discordid = session.get('discordid');
        if (discordid) {
            throw new ForbiddenException('You are already logged in');
        }

        let code = Math.floor(1000 + Math.random() * 9000);
        while(this.codes.has(code)) {
            code = Math.floor(1000 + Math.random() * 9000);
        }

        const expiresAt = Date.now() + this.codeTimeout;

        this.codes.set(code, { 
            expiresAt,
            session,
        });

        setTimeout(() => {
            this.codes.delete(code);
        }, this.codeTimeout);

        return {
            code,
            expiresAt,
        };
    }

    validateCode(code: number, discordId: string) {
        const codeData = this.codes.get(code);
        
        if (!codeData) {
            return false;
        }
        
        if (codeData.expiresAt < Date.now()) {
            this.codes.delete(code);
            return false;
        }
        
        codeData.session.set('discordid', discordId);
        this.codes.delete(code);
        
        return true;
    }
}
