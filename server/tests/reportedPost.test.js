const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

const reportedPost = require("../models/reportedPost");
const Question = require("../models/questions");
const User = require("../models/users");

let mongoServer;

jest.mock("../models/reportedPost");

jest.mock("../models/questions");

let server;


const tag1 = {
    _id: '507f191e810c19729de860ea',
    name: 'tag1'
  };
  const tag2 = {
    _id: '65e9a5c2b26199dbcc3e6dc8',
    name: 'tag2'
  };
  
  const ans1 = {
    _id: '65e9b58910afe6e94fc6e6dc',
    text: 'Answer 1 Text',
    ans_by: 'answer1_user',
    
  }
  
  const ans2 = {
    _id: '65e9b58910afe6e94fc6e6dd',
    text: 'Answer 2 Text',
    ans_by: 'answer2_user',
    
  }
  
  const mockQuestions = [
    {
        _id: '65e9b58910afe6e94fc6e6dc',
        title: 'Question 1 Title',
        text: 'Question 1 Text',
        tags: [tag1],
        answers: [ans1],
        views: 21
    },
    {
        _id: '65e9b5a995b6c7045a30d823',
        title: 'Question 2 Title',
        text: 'Question 2 Text',
        tags: [tag2],
        answers: [ans2],
        views: 99
    }
  ]

describe("POST /reportPost", () => {

      afterAll(async () => {
        jest.resetAllMocks();
        await mongoose.disconnect();
      });
    
      beforeEach(() => {
        server = require("../server");
        jest.resetAllMocks();
    });
    
      afterEach(async() => {
        server.close();
      });

  
    it("POST /should report post when user is logged in", async () => {
      // Mocking the request body
      const mockReqBody = {
        qid: "dummyQuestionId",
      };
  
      const mockReportedPost = {
        _id: "dummyQuestionId",
        reportedAt: "2024-04-18T22:24:29.302Z"
      }
  
      const respToken = await supertest(server).get('/');
      let connectSidValue = null;
  
      if (respToken.headers['set-cookie']) {
          respToken.headers['set-cookie'].forEach(cookie => {
              if (cookie.includes('connect.sid')) {
                  connectSidValue = cookie.split(';')[0].split('=')[1];
              }
          });
      }
  
      // Mock User
      const mockUser = {
        username: 'user1',
        password: 'password1',
        first_name: 'Test',
        last_name: 'User'
    };
  
      // Sign up and login first
      await supertest(server).post('/user/signUp').send(mockUser);
      await supertest(server).post('/user/login')
      .send({username: 'user1', password: 'password1'})
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
  
  
      // Mocking the reportedPost.findOne method
      reportedPost.findOne = jest.fn().mockResolvedValueOnce(null);

      // Mocking the reportedPost.create method
      reportedPost.create = jest.fn().mockResolvedValueOnce(mockReportedPost);
  
      // Making the request
      const response = await supertest(server)
        .post("/reportedPost/reportPost")
        .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReportedPost);
  
      // Verifying that Answer.create method was called with the correct arguments
      expect(reportedPost.create).toHaveBeenCalledWith({
        qid : "dummyQuestionId"
      });
  
      // Verifying that Question.findOneAndUpdate method was called with the correct arguments
      expect(reportedPost.findOne).toHaveBeenCalledWith(
        { qid: "dummyQuestionId" }
      );
    });

    it("POST /should not report post when user is not logged in", async () => {
        // Mocking the request body
        const mockReqBody = {
          qid: "dummyQuestionId",
        };
        // Making the request
        const response = await supertest(server)
          .post("/reportedPost/reportPost")
          .send(mockReqBody);

        // Asserting the response
        expect(response.status).toBe(401);
        expect(response.text).toEqual('Login First');
      });
  
      it("POST /should not be able to report post when already reported", async () => {
      // Mocking the request body
      const mockReqBody = {
        qid: "dummyQuestionId",
      };
  
      const mockReportedPost = {
        _id: "dummyQuestionId",
        reportedAt: "2024-04-18T22:24:29.302Z"
      }
  
      const respToken = await supertest(server).get('/');
      let connectSidValue = null;
  
      if (respToken.headers['set-cookie']) {
          respToken.headers['set-cookie'].forEach(cookie => {
              if (cookie.includes('connect.sid')) {
                  connectSidValue = cookie.split(';')[0].split('=')[1];
              }
          });
      }
  
      // Mock User
      const mockUser = {
        username: 'user1',
        password: 'password1',
        first_name: 'Test',
        last_name: 'User'
    };
  
      // Sign up and login first
      await supertest(server).post('/user/signUp').send(mockUser);
      await supertest(server).post('/user/login')
      .send({username: 'user1', password: 'password1'})
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
  
      // Mocking the reportedPost.findOne method
      reportedPost.findOne = jest.fn().mockResolvedValueOnce(mockReportedPost);

  
      // Making the request
      const response = await supertest(server)
        .post("/reportedPost/reportPost")
        .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({"message":"Post already reported"});
    });
  
  });


describe("POST /getReportedPost", () => {

    beforeAll(async () => {
      try {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        const modUser = await User.create({
            username: "mod",
            password: "mod",
            first_name: "Mod",
            last_name: "Erator",
            roles: ['moderator']
        });
      
    } catch (error) {
        console.error("Error in beforeAll:", error);
    }
    
    });
    
    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    afterEach(async () => {
      const collections = await mongoose.connection.db.collections();
    
      for (let collection of collections) {
          await collection.deleteMany({});
      }
    });
  
    it("GET /should able to get the reported posts  when user is logged in as moderator", async () => {
      // Mocking the request body
      const mockReqBody = {
        qid: "dummyQuestionId",
      };
  
      const mockReportedPost1 = {
        _id: "dummyId1",
        qid: "65e9b58910afe6e94fc6e6dc",
        reportedAt: "2024-04-18T22:24:29.302Z"
      }

      const mockReportedPost2 = {
        _id: "dummyId2",
            qid: "65e9b5a995b6c7045a30d823",
            reportedAt: "2024-07-18T22:24:29.302Z"
      }
  
      const respToken = await supertest(server).get('/');
      let connectSidValue = null;
  
      if (respToken.headers['set-cookie']) {
          respToken.headers['set-cookie'].forEach(cookie => {
              if (cookie.includes('connect.sid')) {
                  connectSidValue = cookie.split(';')[0].split('=')[1];
              }
          });
      }
  
      const log = await supertest(server).post('/user/login')  
      .send({username: 'mod', password: 'mod'})
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
  
  
      // Mocking the reportedPost.find method
      reportedPost.find = jest.fn().mockResolvedValueOnce([mockReportedPost1, mockReportedPost2]);

      // Mocking the Question.find method
      Question.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockQuestions)
      });
  
      // Making the request
      const response = await supertest(server)
        .get("/reportedPost/getReportedPosts").set('Cookie', [`connect.sid=${connectSidValue}`]);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);
  
    });

    it("GET /should not get the reported posts when role is user", async () => {     
        // Generating the cookie
        const respToken = await supertest(server).get('/');
        let connectSidValue = null;
    
        if (respToken.headers['set-cookie']) {
            respToken.headers['set-cookie'].forEach(cookie => {
                if (cookie.includes('connect.sid')) {
                    connectSidValue = cookie.split(';')[0].split('=')[1];
                }
            });
        }

        const mockUser = {
          username: 'user1',
          password: 'password1',
          first_name: 'Test',
          last_name: 'User'
      };
        await supertest(server).post('/user/signup').send(mockUser) 

        // Loggin in as a normal user
        const log = await supertest(server).post('/user/login')  
        .send({username: 'user1', password: 'password1'})
        .set('Cookie', [`connect.sid=${connectSidValue}`]);
    
        // Making the request
        const response = await supertest(server)
          .get("/reportedPost/getReportedPosts").set('Cookie', [`connect.sid=${connectSidValue}`]);
  
        // Asserting the response
        expect(response.status).toBe(403);
        expect(response.text).toEqual('Action can only be performed by a moderator');
    });

    it("GET /should not be able to get the reported posts when not logged in", async () => {  
        // Get the cookie  
        const respToken = await supertest(server).get('/');
        let connectSidValue = null;
    
        if (respToken.headers['set-cookie']) {
            respToken.headers['set-cookie'].forEach(cookie => {
                if (cookie.includes('connect.sid')) {
                    connectSidValue = cookie.split(';')[0].split('=')[1];
                }
            });
        }
        // Mock Login and Logout
        await supertest(server).post('/user/login')  
        .send({username: 'user1', password: 'password1'});
        await supertest(server).post('/user/login');

        // Mock reported posts
        const mockReportedPost1 = {
            _id: "dummyId1",
            qid: "65e9b58910afe6e94fc6e6dc",
            reportedAt: "2024-04-18T22:24:29.302Z"
          }
    
          const mockReportedPost2 = {
            _id: "dummyId2",
                qid: "65e9b5a995b6c7045a30d823",
                reportedAt: "2024-07-18T22:24:29.302Z"
          }
    
        // Mocking the reportedPost.find method
        reportedPost.find = jest.fn().mockResolvedValueOnce([mockReportedPost1, mockReportedPost2]);
  
        // Mocking the Question.find method
        Question.find = jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockQuestions)
        });
    
        // Making the request
        const response = await supertest(server)
          .get("/reportedPost/getReportedPosts").set('Cookie', [`connect.sid=${connectSidValue}`]);
  
        // Asserting the response
        expect(response.status).toBe(403);
        expect(response.text).toEqual('Access denied');
    
      });
  });


  describe("POST /deleteReportedPost", () => {
  
    beforeAll(async () => {
      try {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        const modUser = await User.create({
            username: "mod",
            password: "mod",
            first_name: "Mod",
            last_name: "Erator",
            roles: ['moderator']
        });
      
    } catch (error) {
        console.error("Error in beforeAll:", error);
    }
    
    });
    
    afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    afterEach(async () => {
      const collections = await mongoose.connection.db.collections();
    
      for (let collection of collections) {
          await collection.deleteMany({});
      }
    });
    it("POST /should able delete the reported posts  when user is logged in as moderator", async () => {
      // Mocking the request body
      const mockReqBody = {
        qid: "65e9b58910afe6e94fc6e6dc"
      }
      // Generating the Cookie
      const respToken = await supertest(server).get('/');
      let connectSidValue = null;
  
      if (respToken.headers['set-cookie']) {
          respToken.headers['set-cookie'].forEach(cookie => {
              if (cookie.includes('connect.sid')) {
                  connectSidValue = cookie.split(';')[0].split('=')[1];
              }
          });
      }
  
      // Login using moderator
      const log = await supertest(server).post('/user/login')  
      .send({username: 'mod', password: 'mod'})
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
  
  
      // Mocking the reportedPost.deleteOne method
      reportedPost.deleteOne =  jest.fn().mockResolvedValue({ deletedCount: 1 });
  
      // Making the request
      const response = await supertest(server)
        .post("/reportedPost/deleteReportedPost")
        .send(mockReqBody)
        .set('Cookie', [`connect.sid=${connectSidValue}`]);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Resolved Successfully' });
  
    });

    it("POST /should not be able to delete reported posts when role is user", async () => {     
        const mockReqBody = {
            qid: "65e9b58910afe6e94fc6e6dc"
        }

        // Generating the cookie
        const respToken = await supertest(server).get('/');
        let connectSidValue = null;
    
        if (respToken.headers['set-cookie']) {
            respToken.headers['set-cookie'].forEach(cookie => {
                if (cookie.includes('connect.sid')) {
                    connectSidValue = cookie.split(';')[0].split('=')[1];
                }
            });
        }

        const mockUser = {
          username: 'user1',
          password: 'password1',
          first_name: 'Test',
          last_name: 'User'
      };
        await supertest(server).post('/user/signup').send(mockUser) 
        // Loggin in as a normal user
        await supertest(server).post('/user/login')  
        .send({username: 'user1', password: 'password1'})
        .set('Cookie', [`connect.sid=${connectSidValue}`]);
    
        // Mocking the reportedPost.deleteOne method
        reportedPost.deleteOne =  jest.fn().mockResolvedValue({ deletedCount: 1 });
    
        // Making the request
        const response = await supertest(server)
            .post("/reportedPost/deleteReportedPost")
            .send(mockReqBody)
            .set('Cookie', [`connect.sid=${connectSidValue}`]);
  
        // Asserting the response
        expect(response.status).toBe(403);
        expect(response.text).toEqual('Action can only be performed by a moderator');
    });

    it("POST /should not be able to delete the reported posts when not logged in", async () => {  
        const mockReqBody = {
            qid: "65e9b58910afe6e94fc6e6dc"
        }
        // Get the cookie  
        const respToken = await supertest(server).get('/');
        let connectSidValue = null;
    
        if (respToken.headers['set-cookie']) {
            respToken.headers['set-cookie'].forEach(cookie => {
                if (cookie.includes('connect.sid')) {
                    connectSidValue = cookie.split(';')[0].split('=')[1];
                }
            });
        }
        // Mock Login and Logout
        await supertest(server).post('/user/login')  
        .send({username: 'user1', password: 'password1'});
        await supertest(server).post('/user/logout');


    
        // Mocking the reportedPost.deleteOne method
        reportedPost.deleteOne =  jest.fn().mockResolvedValue({ deletedCount: 1 });
    
        // Making the request
        const response = await supertest(server)
                    .post("/reportedPost/deleteReportedPost")
                    .send(mockReqBody)
                    .set('Cookie', [`connect.sid=${connectSidValue}`]);


        // Asserting the response
        expect(response.status).toBe(403);
        expect(response.text).toEqual('Access denied');
    
      });
  });



  