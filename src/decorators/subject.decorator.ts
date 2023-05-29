import { SetMetadata } from '@nestjs/common';

export const Subject = (value: string) => SetMetadata('subject', value);
