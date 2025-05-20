import { Module, forwardRef } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [DiscordService],
    exports: [DiscordService],
})
export class DiscordModule { } 