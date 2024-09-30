import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Vote Management', () => {
    let adminToken;
    let userToken;
    
    before(async () => {
        const adminResponse = await request(app)
            .post('/users/register')
            .send({
                email: 'admin@example.com',
                password: 'Admin12345',
                role: 'admin'
            });
        adminToken = adminResponse.body.token;

        const userResponse = await request(app)
            .post('/users/register')
            .send({
                email: 'user@example.com',
                password: 'User12345'
            });
        userToken = userResponse.body.token;
    });

    it('should create a new vote as admin', async () => {
        const response = await request(app)
            .post('/votes')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                question: 'What is your favorite programming language?',
                options: [{ text: 'JavaScript' }, { text: 'Python' }]
            });
        expect(response.status).to.equal(201);
    });

    it('should allow a user to vote', async () => {
        const voteResponse = await request(app)
            .post('/votes')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                question: 'What is your favorite programming language?',
                options: [{ text: 'JavaScript' }, { text: 'Python' }]
            });
        
        const voteId = voteResponse.body._id;
        const optionId = voteResponse.body.options[0]._id;
    
        const response = await request(app)
            .post(`/votes/${voteId}/vote`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                optionId: optionId 
            });
        expect(response.status).to.equal(200);
    });    
});
