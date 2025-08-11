import type { Prisma } from '@prisma/client';

import type { GET_USERS_PAYLOAD } from './users.config';

export type UserPayload = Prisma.UserGetPayload<typeof GET_USERS_PAYLOAD>;
