import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'loveStoryDrive',
  access: (allow) => ({
    'media/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
