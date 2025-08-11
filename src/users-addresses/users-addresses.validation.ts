import type { HandleErrorsResult } from 'src/errorHandler/errorHandler.types';
import { z } from 'zod';

import {
  ISO_COUNTRY_CODES_LIST,
  type UserAddressPayload,
  type UserAddressPrimaryKeyPayload,
} from './users-addresses.config';

const MIN_STRING_LENGTH = 1;
const MAX_POST_CODE_LENGTH = 6;
const MAX_CITY_LENGTH = 60;
const MAX_STREET_LENGTH = 100;
const MAX_BUILDING_NUMBER_LENGTH = 60;

export const userAddressPrimaryKeySchema: z.ZodSchema<UserAddressPrimaryKeyPayload> = z.object({
  userId: z.number().int().positive({
    error: 'User ID must be a positive integer',
  }),
  addressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK'], {
    error: 'Select a valid address type',
  }),
  validFrom: z.date().refine((date) => !Number.isNaN(date.getTime()), {
    error: 'Valid from date must be a valid date',
  }),
});

export const userAddressSchema: z.ZodSchema<UserAddressPayload> = z.object({
  userId: z.number().int().positive({
    error: 'User ID must be a positive integer',
  }),
  addressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK'], {
    error: 'Select a valid address type',
  }),
  validFrom: z.date().refine((date) => !Number.isNaN(date.getTime()), {
    error: 'Valid from date must be a valid date',
  }),
  postCode: z
    .string()
    .min(MIN_STRING_LENGTH, { error: 'Post code is required' })
    .max(MAX_POST_CODE_LENGTH, {
      error: `Post code must be at most ${MAX_POST_CODE_LENGTH} characters long`,
    }),
  city: z
    .string()
    .min(MIN_STRING_LENGTH, 'City is required')
    .max(MAX_CITY_LENGTH, { error: `City must be at most ${MAX_CITY_LENGTH} characters long` }),
  countryCode: z.enum(ISO_COUNTRY_CODES_LIST as [string, ...string[]], {
    error: 'Select a valid country code',
  }),
  street: z
    .string()
    .min(MIN_STRING_LENGTH, { error: 'Street is required' })
    .max(MAX_STREET_LENGTH, {
      error: `Street must be at most ${MAX_STREET_LENGTH} characters long`,
    }),
  buildingNumber: z
    .string()
    .min(MIN_STRING_LENGTH, { error: 'Building number is required' })
    .max(MAX_BUILDING_NUMBER_LENGTH, {
      error: `Building number must be at most ${MAX_BUILDING_NUMBER_LENGTH} characters long`,
    }),
});

export type ValidUserAddressPayload = z.infer<typeof userAddressSchema>;
export type ValidUserAddressPrimaryKeyPayload = z.infer<typeof userAddressPrimaryKeySchema>;

export const isAddressType = (value: string): value is ValidUserAddressPayload['addressType'] => {
  return ['HOME', 'INVOICE', 'POST', 'WORK'].includes(value);
};

export const validateUserAddressPrimaryKey = (
  value: Partial<UserAddressPrimaryKeyPayload>,
): HandleErrorsResult<ValidUserAddressPrimaryKeyPayload> => {
  const result = userAddressPrimaryKeySchema.safeParse(value);

  if (!result.success) {
    return {
      isSuccess: false,
      isUnknownError: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  return {
    isSuccess: true,
    data: result.data,
  };
};

export const validateUserAddress = (
  values: UserAddressPayload,
): HandleErrorsResult<ValidUserAddressPayload> => {
  const result = userAddressSchema.safeParse(values);

  if (!result.success) {
    return {
      isSuccess: false,
      isUnknownError: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  return {
    isSuccess: true,
    data: result.data,
  };
};
