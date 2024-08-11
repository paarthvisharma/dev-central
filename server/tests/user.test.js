const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/users');
const server = require('../server'); 

describe('Authentication tests', () => {
    let request;

    beforeAll(() => {
        request = supertest(server);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await server.close();  
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    async function getSessionCookie(request) {
        const respToken = await request.get('/');
        let connectSidValue = null;
    
        if (respToken.headers['set-cookie']) {
            respToken.headers['set-cookie'].forEach(cookie => {
                if (cookie.includes('connect.sid')) {
                    connectSidValue = cookie.split(';')[0].split('=')[1];
                }
            });
        }
        return connectSidValue;
    }

    async function signUpUser(){
        const userData = {
            username: 'customUser',
            password: 'password1',
            first_name: 'Test',
            last_name: 'User'
        };
        const res = await request.post('/user/signUp').send(userData);
        return res;
    }

    const fakeUser = { username: 'customUser', password: 'password1' };

    describe('SignUp', () => {
        it('POST /should create a new user', async () => {
            const response = await signUpUser();
            expect(response.status).toBe(200);
            expect(response.body.username).toEqual('customUser');
            expect(response.body.username).toBe(fakeUser.username);
        });
    });

    describe('Login', () => {
        it('POST /should login successfully with correct credentials', async () => {
            const connectSidValue = await getSessionCookie(request);
            await signUpUser();
            const loginData = { username: 'customUser', password: 'password1' };
            const response = await request.post('/user/login').send(loginData).set('Cookie', [`connect.sid=${connectSidValue}`]);

            expect(response.status).toBe(200);
            expect(response.body.username).toEqual(fakeUser.username);
        });

        it('POST /login must return 401 status if the user gives invalid password, has a session', async () => {
            const connectSidValue = await getSessionCookie(request);
            const loginData = { username: 'customUser', password: 'wrongpassword' };
            const response = await request.post('/user/login').send(loginData).set('Cookie', [`connect.sid=${connectSidValue}`]);;
            expect(response.status).toBe(401);
        });

        it('POST /login must return 404 if the user is valid but has no session', async () => {
            const connectSidValue = await getSessionCookie(request);
        
            const loginData = { username: 'customUser', password: 'password1' };
            const response = await request.post('/login').send(loginData);
            expect(response.status).toBe(404);
          });
    });

    describe('GetCurrentUser', () => {
        it('GET /should get the current user data', async () => {

            const connectSidValue = await getSessionCookie(request);
            await signUpUser();
            const loginData = { username: 'customUser', password: 'password1' };
            await request.post('/user/login').send(loginData).set('Cookie', [`connect.sid=${connectSidValue}`]);
            const response = await request.get('/user/getCurrentUser').set('Cookie', [`connect.sid=${connectSidValue}`]);
            expect(response.status).toBe(200);
            expect(response.body.username).toEqual(fakeUser.username);
        });

        it('GET /should not get user data if not logged in', async () => {
            await request.post('/user/logout');
            const response = await request.get('/user/getCurrentUser');
            expect(response.text).toContain('Login First');
        });
    });

    describe('ModifyUser', () => {
        it('POST /should modify user details', async () => {
            const connectSidValue = await getSessionCookie(request);
            await signUpUser();
            const loginData = { username: 'customUser', password: 'password1' };
            await request.post('/user/login').send(loginData).set('Cookie', [`connect.sid=${connectSidValue}`]);

            const modifyData = {password: 'passwordNew'};
            const response = await request.put('/user/modifyUser').send(modifyData).set('Cookie', [`connect.sid=${connectSidValue}`]);
            expect(response.status).toBe(200);
            
            // Login again with new password to verify is the update was successful
            await request.post('/user/login').send( { username: 'customUser', password: 'passwordNew' }).set('Cookie', [`connect.sid=${connectSidValue}`]);
            expect(response.status).toBe(200);
        });

        it('GET /should not be able to modify data if not logged in', async () => {
            await request.post('/user/logout');

            const connectSidValue = await getSessionCookie(request);

            const modifyData = {password: 'passwordNew'};
            const response = await request.put('/user/modifyUser').send(modifyData).set('Cookie', [`connect.sid=${connectSidValue}`]);
            expect(response.text).toContain('Login First');
        });
    });

    describe('Logout', () => {
        it('should logout the user', async () => {
            const response = await request.post('/user/logout');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
