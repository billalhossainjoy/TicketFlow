import { Auth } from './auth.js';
import { CurrentUserDto } from './dtos/current-user.dto.js';

export class AuthService {
  constructor(private auth: Auth) {}

  async getCurrentUser(headers: Headers): Promise<CurrentUserDto | null> {
    const session = await this.auth.api.getSession({ headers });

    if (!session) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
    };
  }
}
