
  import {
    createUser,
    authenticateUser,
    getUser,
    editUser,
    getUsers,
  } from '../../src/controllers/userController.js';
  import UserModel from '../../src/models/userModel.js';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';

  jest.mock('../../src/models/userModel.js');
  jest.mock('bcrypt');
  jest.mock('jsonwebtoken');

  describe('User Controller', () => {
    let req, res, userModelInstance;

    beforeEach(() => {
      req = {
        body: {},
        query: {},
        userEmail: 'test@example.com',
        userId: 1,
        cookies: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        cookie: jest.fn(),
      };

      userModelInstance = {
        create: jest.fn(),
        read: jest.fn(),
        patch: jest.fn(),
        getAll: jest.fn(),
      };

      UserModel.mockImplementation(() => userModelInstance);
      process.env.JWT_SECRET = 'test_secret';
    });

    describe('createUser', () => {
      it('створює користувача і повертає 201', async () => {
        req.body = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'secret',
        };

        bcrypt.hash.mockResolvedValue('hashedpassword');
        await createUser(req, res);

        expect(userModelInstance.create).toHaveBeenCalledWith(
          expect.objectContaining({
            username: 'testuser',
            email: 'test@example.com',
            password_hash: 'hashedpassword',
          })
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
      });

      it('повертає 400 при помилці валідації', async () => {
        req.body = {};
        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(Array));
      });

      it('повертає 500 при іншій помилці', async () => {
        req.body = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'secret',
        };
        bcrypt.hash.mockRejectedValue(new Error('DB error'));
        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('DB error');
      });
    });

    describe('authenticateUser', () => {
      it('авторизує користувача і повертає токен', async () => {
        req.body = {
          email: 'test@example.com',
          password: 'secret',
        };

        const user = {
          id: 1,
          email: 'test@example.com',
          password_hash: 'hashed',
          role: 'admin',
        };

        userModelInstance.read.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token');

        await authenticateUser(req, res);

        expect(res.cookie).toHaveBeenCalledWith(
          'token',
          'token',
          expect.objectContaining({ httpOnly: true })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
          expect.not.objectContaining({ id: expect.anything(), password_hash: expect.anything(), role: expect.anything() })
        );
      });

      it('повертає 401, якщо користувач не знайдений', async () => {
        req.body = { email: 'notfound@example.com', password: 'validpassword123' };
        userModelInstance.read.mockResolvedValue(null);

        await authenticateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it('повертає 401, якщо пароль неправильний', async () => {
        req.body = { email: 'test@example.com', password: 'wrongpass' };
        userModelInstance.read.mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password_hash: 'hashed',
          role: 'user',
        });      
        bcrypt.compare.mockResolvedValue(false);

        await authenticateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it('повертає 400 при ZodError', async () => {
        req.body = {};
        await authenticateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('getUser', () => {
      it('повертає користувача', async () => {
        userModelInstance.read.mockResolvedValue({
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
        });
    
        await getUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
        });
      });
    });  

    describe('editUser', () => {
      it('оновлює користувача', async () => {
        req.body = { username: 'newName' };
        userModelInstance.patch.mockResolvedValue({
          username: 'newName',
          email: 'test@example.com',
          role: 'user',
        });      
        await editUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          username: 'newName',
          email: 'test@example.com',
          role: 'user',
        });
      });

      it('повертає 400 при ZodError', async () => {
        req.body = {};
        await editUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('getUsers', () => {
      it('повертає список користувачів', async () => {
        req.query = { page: '1', limit: '2', name: 'test' };
        userModelInstance.getAll.mockResolvedValue([
          { username: 'user1', email: 'user1@example.com', role: 'user' },
          { username: 'user2', email: 'user2@example.com', role: 'user' },
        ]);        

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          users: [
            { email: 'user1@example.com', username: 'user1', role: 'user' },
        { email: 'user2@example.com', username: 'user2', role: 'user' },
          ],
        });
      });

      it('повертає 500 при помилці', async () => {
        userModelInstance.getAll.mockRejectedValue(new Error('fail'));
        await getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('fail');
      });
    });
  });
