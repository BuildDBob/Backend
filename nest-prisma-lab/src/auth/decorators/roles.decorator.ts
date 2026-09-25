/*
AI Declaration:
I used Gemini to help debug setting up Roles enum.
I wrote all the other code, and I understand the entire implementation.

Reflection:
It helped me understand the entire workflow by elaborating on my own explanation and aiding in debugging.
*/

import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);