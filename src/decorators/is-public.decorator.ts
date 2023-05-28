import { SetMetadata } from '@nestjs/common';

export const IsPublic = () => SetMetadata('is-public', true);
