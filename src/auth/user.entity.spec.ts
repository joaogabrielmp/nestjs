import { hash } from 'bcryptjs';

import { User } from './user.entity';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      (hash as any) = jest.fn().mockResolvedValue('testPassword');

      expect(hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('123456');

      expect(hash).toHaveBeenCalledWith('123456', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      (hash as any) = jest.fn().mockResolvedValue('wrongPassword');

      expect(hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('wrongPassword');

      expect(hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
