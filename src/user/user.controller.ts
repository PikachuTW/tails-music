import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DiscordIdDto } from 'src/common/dto/discord.dto';
import { DiscordService } from 'src/discord/discord.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly discordService: DiscordService) {}

  @Get(':id')
  async getById(@Param() { id }: DiscordIdDto) {
    if (!id) throw new BadRequestException('Missing query parameter: id');

    try {
      const user = await this.discordService.getUserById(id);
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(`DiscordService.getUserById error: ${err}`);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }
}
