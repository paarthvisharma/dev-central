// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");
// Mock the Answer model
jest.mock("../models/answers");

let server;
let mongoServer;

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1'
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ans_by: 'answer1_user',
  
}

const mockQuestion =
  {
      _id: '65e9b58910afe6e94fc6e6dc',
      title: 'Question 1 Title',
      text: 'Question 1 Text',
      tags: [tag1],
      answers: [ans1],
      views: 21
  }
  
describe("POST /addAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it("should add a new answer to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };

    const mockAnswer = {
      _id: "dummyAnswerId",
      text: "This is a test answer"
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
    const test1 = await supertest(server).post('/user/signUp').send(mockUser);
    await supertest(server).post('/user/login')
    .send({username: 'user1', password: 'password1'})
    .set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.create).toHaveBeenCalledWith({
      ans_by: "user1",
      text: "This is a test answer"
    });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answers: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });


  
});


describe("POST /upVote", () => {

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

  it("POST /should add a vote when logged in", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
    };

    const mockUpdatedAnswer = {
      _id: "dummyAnswerId",
      voted_by: ["user2"],
      ans_votes: 1

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
      username: 'user2',
      password: 'password2',
      first_name: 'Test2',
      last_name: 'User2'
  };

    // Sign up and login first
    await supertest(server).post('/user/signUp').send(mockUser);
    await supertest(server).post('/user/login')
    .send({username: 'user2', password: 'password2'})
    .set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Mock the create method of the Answer model
    Answer.findOne = jest.fn().mockResolvedValue({
      _id: "dummyAnswerId",
      voted_by: [],
      ans_votes: 0
    });

    // Mocking the Answer.findOneAndUpdate method
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyAnswerId",
      voted_by: ["user2"],
      ans_votes: 1
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/upVote")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockUpdatedAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.findOne).toHaveBeenCalledWith({ _id: "dummyAnswerId" });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Answer.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyAnswerId" },
      { $inc: { ans_votes: 1 }, $push: { voted_by: "user2" } },
      { new: true }
    );
  });

  it("POST /should not add a vote when not logged in", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
    };

    // Making the request
    const response = await supertest(server)
      .post("/answer/upVote")
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(401);
    expect(response.body).toEqual({"message": "Login First"});
  });

  it("POST /should not add a vote if user has alrady voted", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
    };

    const mockUpdatedAnswer = {
      _id: "dummyAnswerId",
      voted_by: ["user2"],
      ans_votes: 1

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
      username: 'user2',
      password: 'password2',
      first_name: 'Test2',
      last_name: 'User2'
  };

    // Sign up and login first
    await supertest(server).post('/user/signUp').send(mockUser);
    await supertest(server).post('/user/login')
    .send({username: 'user2', password: 'password2'})
    .set('Cookie', [`connect.sid=${connectSidValue}`]);

   // Mock the create method of the Answer model
    Answer.findOne = jest.fn().mockResolvedValue({
      _id: "dummyAnswerId",
      voted_by: ["user2"],
      ans_votes: 1
    });


    // Making the request
    const response = await supertest(server)
      .post("/answer/upVote")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({"message": 'You have already voted'});
  });
});



describe("POST /downVote", () => {

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

  it("POST /should add a downVote when logged in", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
    };

    const mockUpdatedAnswer = {
      _id: "dummyAnswerId",
      voted_by: ["user2"],
      ans_votes: -1

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
      username: 'user2',
      password: 'password2',
      first_name: 'Test2',
      last_name: 'User2'
  };

    // Sign up and login first
    await supertest(server).post('/user/signUp').send(mockUser);
    await supertest(server).post('/user/login')
    .send({username: 'user2', password: 'password2'})
    .set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Mock the create method of the Answer model
    Answer.findOne = jest.fn().mockResolvedValue({
      _id: "dummyAnswerId",
      voted_by: [],
      ans_votes: 0
    });

    // Mocking the Answer.findOneAndUpdate method
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyAnswerId",
      voted_by: ["user2"],
      ans_votes: -1
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/downVote")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockUpdatedAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.findOne).toHaveBeenCalledWith({ _id: "dummyAnswerId" });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Answer.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyAnswerId" },
      { $inc: { ans_votes: -1 }, $push: { voted_by: "user2" } },
      { new: true }
    );
  });

  it("POST /should not be able to downVote when not logged in", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
    };

    // Making the request
    const response = await supertest(server)
      .post("/answer/downVote")
      .send(mockReqBody);
      
    // Asserting the response
    expect(response.status).toBe(401);
    expect(response.body).toEqual({"message": "Login First"});
  });

  it("POST /should not be able to downVote if user has alrady voted", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
    };

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
      username: 'user2',
      password: 'password2',
      first_name: 'Test2',
      last_name: 'User2'
  };

    // Sign up and login first
    await supertest(server).post('/user/signUp').send(mockUser);
    await supertest(server).post('/user/login')
    .send({username: 'user2', password: 'password2'})
    .set('Cookie', [`connect.sid=${connectSidValue}`]);

   // Mock the create method of the Answer model
    Answer.findOne = jest.fn().mockResolvedValue({
      _id: "dummyAnswerId",
      voted_by: ["user2"],
      ans_votes: 1
    });


    // Making the request
    const response = await supertest(server)
      .post("/answer/downVote")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({"message": 'You have already voted'});
  });
});


describe("POST /deleteAnswer", () => {

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

  it("POST /should be able to deleteAnswer when logged in as moderator", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
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
    // Mock the find method of the Answer model
    Answer.findById = jest.fn().mockResolvedValue({ans1});
    Answer.findByIdAndDelete = jest.fn().mockResolvedValue({ans1});
    Question.findByIdAndUpdate = jest.fn().mockResolvedValue({mockQuestion});

    // Making the request
    const response = await supertest(server)
      .post("/answer/deleteAnswer")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Answers deleted successfully.' });
  });

  it("POST /should not be able to deleteAnswer when logged in as a normal user", async () => {
     // Mocking the request body
     const mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
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

    // Mock the find method of the Answer model
    Answer.findById = jest.fn().mockResolvedValue({ans1});
    Answer.findByIdAndDelete = jest.fn().mockResolvedValue({ans1});
    Question.findByIdAndUpdate = jest.fn().mockResolvedValue({mockQuestion});

    // Making the request
    const response = await supertest(server)
      .post("/answer/deleteAnswer")
      .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(403);
    expect(response.text).toEqual('Action can only be performed by a moderator');

  });

  it("POST /should not be able to deleteAnswer when not logged in ", async () => {
    // Mocking the request body
    const mockReqBody = {
     aid: "65e9b58910afe6e94fc6e6dc",
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

   // Mock the find method of the Answer model
   Answer.findById = jest.fn().mockResolvedValue({ans1});
   Answer.findByIdAndDelete = jest.fn().mockResolvedValue({ans1});
   Question.findByIdAndUpdate = jest.fn().mockResolvedValue({mockQuestion});

   // Making the request
   const response = await supertest(server)
     .post("/answer/deleteAnswer")
     .send(mockReqBody).set('Cookie', [`connect.sid=${connectSidValue}`]);

   // Asserting the response
   expect(response.status).toBe(403);
   expect(response.text).toEqual('Access denied');

 });
});







