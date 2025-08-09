export const DEFAULT_USERS_PAGE_INDEX = 1;

export const USERS_PER_PAGE = 5;

export const GET_USERS_PAYLOAD = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    initials: true,
    email: true,
    status: true,
  },
} as const;
