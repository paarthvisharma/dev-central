// unit tests for functions in controller/question.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

const Question = require('../models/questions');
const Answer = require('../models/answers');
const User = require('../models/users');

const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');
const { request } = require("express");
const server = require("../server");

// Mocking the models
jest.mock("../models/questions");
jest.mock('../utils/question', () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));
jest.mock('../models/answers', () => ({
  deleteMany: jest.fn(),
}));
let mongoServer;



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
const mockQuestion1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  title: 'Question 1 Title',
  text: 'Question 1 Text',
  tags: [tag1],
  answers: [ans1],
  views: 21
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

describe('GET /getQuestion', () => {

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });


  it('should return questions by filter', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'someOrder',
      search: 'someSearch',
    };
   
    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);
    // Making the request
    const response = await supertest(server)
      .get('/question/getQuestion')
      .query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });
});

describe('GET /getQuestionById/:qid', () => {


  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it('should return a question by id and increment its views by 1', async () => {

    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockPopulatedQuestion = {
        answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
        views: mockQuestions[1].views + 1
    };
    
    // Provide mock question data
    Question.findOneAndUpdate = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockPopulatedQuestion)}));
   
    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedQuestion);
  });
});

describe('POST /addQuestion', () => {

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
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

  it('should add a new question', async () => {
    // Authenticate to add new question

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

    // Mock request body

    const mockTags = [tag1, tag2]; 

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server).post('/question/addQuestion')
      .send(mockQuestion).set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);

    // Logout
    await supertest(server).post('/user/logout');

  });
  
  it('POST /should not add a new question if not logged in', async () => {

    const mockTags = [tag1, tag2]; 

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server).post('/question/addQuestion')
      .send(mockQuestion);
    // Asserting the response
    expect(response.status).toBe(401);
    expect(response.body).toEqual({"message": "Login First"});

  });

});

describe("POST /deleteQuestion", () => {


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

  it("POST /should be able to deleteQuestion when logged in as moderator", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc"
    };

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
    // Login with moderator
    const log = await supertest(server).post('/user/login')
    .send({username: 'mod', password: 'mod'}).set('Cookie', [`connect.sid=${connectSidValue}`]);
    // Mock the methods
    Question.findById = jest.fn().mockResolvedValue({mockQuestion1});
    Question.findByIdAndDelete = jest.fn().mockResolvedValue({mockQuestion1});
    Answer.deleteMany = jest.fn().mockResolvedValue({ans1});

    // Making the request
    const response = await supertest(server)
      .post("/question/deleteQuestion")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Question and all associated answers deleted successfully." });
  });

  it("POST /should not be able to deleteQuestion when logged in as a normal user", async () => {
     // Mocking the request body
     const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc"
    };

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

    // Login with normal user
    const mockUser = {
      username: 'user1',
      password: 'password1',
      first_name: 'Test',
      last_name: 'User'
  };

    // Sign up and login first
    await supertest(server).post('/user/signUp').send(mockUser);

    // Login and logout
    await supertest(server).post('/user/login')
    .send({username: 'user1', password: 'password1'})
    .set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Mock the methods
    Question.findById = jest.fn().mockResolvedValue({mockQuestion1});
    Question.findByIdAndDelete = jest.fn().mockResolvedValue({mockQuestion1});
    Answer.deleteMany = jest.fn().mockResolvedValue({ans1});

    // Making the request
    const response = await supertest(server)
      .post("/question/deleteQuestion")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(403);
    expect(response.text).toEqual('Action can only be performed by a moderator');

  });

  it("POST /should not be able to deleteQuestion when not logged in ", async () => {
    // Mocking the request body
    const mockReqBody = {
     qid: "65e9b58910afe6e94fc6e6dc"
   };

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

   // Login with normal user
   const mockUser = {
     username: 'user1',
     password: 'password1',
     first_name: 'Test',
     last_name: 'User'
 };

   // Don't pass cookie to ensure no user is logged in
   await supertest(server).post('/user/signUp').send(mockUser);

   const log = await supertest(server).post('/user/login')
   .send({username: 'user1', password: 'password1'});

    // Mock the methods
    Question.findById = jest.fn().mockResolvedValue({mockQuestion1});
    Question.findByIdAndDelete = jest.fn().mockResolvedValue({mockQuestion1});
    Answer.deleteMany = jest.fn().mockResolvedValue({ans1});

    // Making the request
    const response = await supertest(server)
      .post("/question/deleteQuestion")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

   // Asserting the response
   expect(response.status).toBe(403);
   expect(response.text).toEqual('Access denied');

 });
});