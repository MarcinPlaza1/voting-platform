import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('User Registration and Login', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/users/register')
            .send({
                email: 'test@example.com',
                password: 'Test12345'
            });
        expect(response.status).to.equal(201);
    });

    it('should not register user with invalid email', async () => {
        const response = await request(app)
            .post('/users/register')
            .send({
                email: 'invalid-email',
                password: 'Test12345'
            });
        expect(response.status).to.equal(400);
    });

    it('should login existing user', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'test@example.com',
                password: 'Test12345'
            });
        expect(response.status).to.equal(200);
    });
});

