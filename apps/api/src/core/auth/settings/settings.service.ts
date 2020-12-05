import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class SettingsService {
  constructor() {}
  async updatePassword(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { password } = updatePasswordDto;

    user.password = await User.hashPassword(password);
    await user.save();
  }
}
