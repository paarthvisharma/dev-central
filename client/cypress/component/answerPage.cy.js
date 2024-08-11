import AnswerHeader from '../../src/components/main/answerPage/header';
import QuestionBody from '../../src/components/main/answerPage/questionBody';
import Answer from '../../src/components/main/answerPage/answer';
import AnswerPage from '../../src/components/main/answerPage';

const regularUser = {
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    roles: ['user']
}

const modUser = {
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    roles: ['user', 'moderator']
}

const answers = [];
for(let index= 0; index < 3; index++){
    let newanswer = {
        _id: "66230952ad351a3b87aa75d" + index,
        text: 'Sample Answer Text ' + index,
        ans_by: 'sampleanswereduser ' + index,
        ans_date_time: new Date(),
        ans_votes: 0,
        voted_by: []
    };
    answers.push(newanswer);
}

const question = {
        "_id": "66230952ad351a3b87aa75dc",
        "title": "test",
        "text": "test",
        "asked_by": "mod",
        "ask_date_time":  "2024-04-20T00:16:18.782Z",
        "views": 2,
        "answers": answers,
        "tags": [
        "test"
        ]
    };

// Answer Page - Header Tests
it('Answer Header component shows question title, answer count and onclick function', () => {
    const answerCount = 3;
    const title = 'android studio save string shared preference, start activity and load the saved string';
    const handleNewQuestion = cy.spy().as('handleNewQuestionSpy');
    
    cy.mount(<AnswerHeader 
        ansCount={answerCount} 
        title={title}
        handleNewQuestion={handleNewQuestion}/>);
    cy.get('.bold_title').contains(answerCount + " answers");
    cy.get('.answer_question_title').contains(title);
    cy.get('.bluebtn').click();
    cy.get('@handleNewQuestionSpy').should('have.been.called');
})

// Answer Page - Question Body
it('Component should have a question body which shows question text, views, asked by and asked', () => {
    const questionBody = 'Sample Question Body'
    const views = '150'
    const askedBy = 'vanshitatilwani'
    const date = new Date().toLocaleString()
    cy.mount(<QuestionBody 
        text={questionBody}
        views={views} 
        askby={askedBy}
        meta={date}
        />)
    
    cy.get('.answer_question_text > div').contains(questionBody)
    cy.get('.answer_question_view').contains(views + ' views')
    cy.get('.answer_question_right > .question_author').contains(askedBy)
    cy.get('.answer_question_right > .answer_question_meta').contains('asked ' + date)
    
})

// // Answer Page - Answer component
describe('Answer Component test - ideal scenarios', () => {
    beforeEach(() => {
        cy.intercept(
            'POST', 
            '/answer/upVote', 
            {
                statusCode: 201,
                body: {
                    "_id": "661da8c28a7a19ed0fddf210",
                    "text": "React Router is mostly a wrapper around the history library.",
                    "ans_by": "hamkalo",
                    "ans_date_time": "2023-11-20T08:24:42.000+00:00",
                    "__v": '0',
                    "ans_votes": 1,
                    "voted_by": ["testuser"]
                }
            }
        ).as('upvote');
        cy.intercept(
            'POST', 
            '/answer/downVote', 
            {
                statusCode: 201,
                body: {
                    "_id": "661da8c28a7a19ed0fddf210",
                    "text": "React Router is mostly a wrapper around the history library.",
                    "ans_by": "hamkalo",
                    "ans_date_time": "2023-11-20T08:24:42.000+00:00",
                    "__v": '0',
                    "ans_votes": -1,
                    "voted_by": ["testuser"]
                }
            }
        ).as('downvote');
    });

    it('Component should have a answer text ,answered by and answered date and number of votes', () => {
        const answerText = 'React Router is mostly a wrapper around the history library.'
        const answeredBy = 'testuser'
        const date = new Date().toLocaleString()
        cy.mount(<Answer 
            text={answerText}
            ansBy={answeredBy}
            meta={date}
            ans_votes={0}
            aid={"661da8c28a7a19ed0fddf210"}
            currentUser={regularUser}
            qid={"66230952ad351a3b87aa75dc"}
            />)
        cy.get('.answerText').contains(answerText)
        cy.get('.answerAuthor > .answer_author').contains(answeredBy)
        cy.get('.answerAuthor > .answer_question_meta').contains(date)
        cy.get('.answer_votes').contains('0 votes');
        cy.get('.vote_button').first().contains('UpVote');
        cy.get('.vote_button').eq(1).contains('DownVote');
    });

    it('Upvote count should increase by 1 when upvote is clicked', () => {
        const answerText = 'React Router is mostly a wrapper around the history library.'
        const answeredBy = 'testuser'
        const date = new Date().toLocaleString()
        cy.mount(<Answer 
            text={answerText}
            ansBy={answeredBy}
            meta={date}
            ans_votes={0}
            aid={"661da8c28a7a19ed0fddf210"}
            currentUser={regularUser}
            qid={"66230952ad351a3b87aa75dc"}
            />)
        cy.get('.answerText').contains(answerText)
        cy.get('.answerAuthor > .answer_author').contains(answeredBy)
        cy.get('.answerAuthor > .answer_question_meta').contains(date)
        cy.get('.answer_votes').contains('0 votes');
        cy.get('.vote_button').first().contains('UpVote');
        cy.get('.vote_button').eq(1).contains('DownVote');
        cy.get('.vote_button').first().click();
        cy.get('.answer_votes').contains('1 votes');
    });

    it('Upvote count should decrease by 1 when upvote is clicked', () => {
        const answerText = 'React Router is mostly a wrapper around the history library.'
        const answeredBy = 'testuser'
        const date = new Date().toLocaleString()
        cy.mount(<Answer 
            text={answerText}
            ansBy={answeredBy}
            meta={date}
            ans_votes={0}
            aid={"661da8c28a7a19ed0fddf210"}
            currentUser={regularUser}
            qid={"66230952ad351a3b87aa75dc"}
            />)
        cy.get('.answerText').contains(answerText)
        cy.get('.answerAuthor > .answer_author').contains(answeredBy)
        cy.get('.answerAuthor > .answer_question_meta').contains(date)
        cy.get('.answer_votes').contains('0 votes');
        cy.get('.vote_button').first().contains('UpVote');
        cy.get('.vote_button').eq(1).contains('DownVote');
        cy.get('.vote_button').eq(1).click();
        cy.get('.answer_votes').contains('-1 votes');
    });
});

describe('Answer Component test - ideal scenarios', () => {
    beforeEach(() => {
        cy.intercept(
            'POST', 
            '/answer/upVote', 
            {
                statusCode: 200
            }
        ).as('upvote');
        cy.intercept(
            'POST', 
            '/answer/downVote', 
            {
                statusCode: 200,
            }
        ).as('downvote');
    });

    it('Alert should be shown on upvote indicating a vote has been made', () => {
        const answerText = 'React Router is mostly a wrapper around the history library.'
        const answeredBy = 'testuser'
        const date = new Date().toLocaleString()
        cy.mount(<Answer 
            text={answerText}
            ansBy={answeredBy}
            meta={date}
            ans_votes={1}
            aid={"661da8c28a7a19ed0fddf210"}
            currentUser={regularUser}
            qid={"66230952ad351a3b87aa75dc"}
            />)
        cy.get('.answerText').contains(answerText)
        cy.get('.answerAuthor > .answer_author').contains(answeredBy)
        cy.get('.answerAuthor > .answer_question_meta').contains(date)
        cy.get('.answer_votes').contains('1 votes');
        cy.get('.vote_button').first().contains('UpVote');
        cy.get('.vote_button').eq(1).contains('DownVote');
        cy.get('.vote_button').first().click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('You have already voted on this answer.');
        });
        cy.get('.answer_votes').contains('1 votes');
    });

    it('Alert should be shown on downvote indicating a vote has been made', () => {
        const answerText = 'React Router is mostly a wrapper around the history library.'
        const answeredBy = 'testuser'
        const date = new Date().toLocaleString()
        cy.mount(<Answer 
            text={answerText}
            ansBy={answeredBy}
            meta={date}
            ans_votes={-1}
            aid={"661da8c28a7a19ed0fddf210"}
            currentUser={regularUser}
            qid={"66230952ad351a3b87aa75dc"}
            />)
        cy.get('.answerText').contains(answerText)
        cy.get('.answerAuthor > .answer_author').contains(answeredBy)
        cy.get('.answerAuthor > .answer_question_meta').contains(date)
        cy.get('.answer_votes').contains('-1 votes');
        cy.get('.vote_button').first().contains('UpVote');
        cy.get('.vote_button').eq(1).contains('DownVote');
        cy.get('.vote_button').eq(1).click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('You have already voted on this answer.');
        });
        cy.get('.answer_votes').contains('-1 votes');
    });
});

describe('Moderator related operations', () => {
    beforeEach(() => {
        cy.intercept(
            'POST', 
            '/answer/deleteAnswer', 
            {
                statusCode: 200,
                body: { 
                    message: 'Answers deleted successfully.' 
                }
            }
        ).as('deleteAnswer');
    });
    
    it('Delete answer is shown for moderator', () => {
        const answerText = 'React Router is mostly a wrapper around the history library.'
        const answeredBy = 'testuser'
        const date = new Date().toLocaleString()
        cy.mount(<Answer 
            text={answerText}
            ansBy={answeredBy}
            meta={date}
            ans_votes={-1}
            aid={"661da8c28a7a19ed0fddf210"}
            currentUser={modUser}
            qid={"66230952ad351a3b87aa75dc"}
            />)
        cy.get('.answerText').contains(answerText)
        cy.get('.answerAuthor > .answer_author').contains(answeredBy)
        cy.get('.answerAuthor > .answer_question_meta').contains(date)
        cy.get('.answer_votes').contains('-1 votes');
        cy.get('.vote_button').first().contains('UpVote');
        cy.get('.vote_button').eq(1).contains('DownVote');
        cy.get('.delete_button').contains('Delete Answer');
    });

    it('Delete answer is clicked by moderator', () => {
        const answerText = 'React Router is mostly a wrapper around the history library.'
        const answeredBy = 'testuser'
        const date = new Date().toLocaleString()
        cy.mount(<Answer 
            text={answerText}
            ansBy={answeredBy}
            meta={date}
            ans_votes={-1}
            aid={"661da8c28a7a19ed0fddf210"}
            currentUser={modUser}
            qid={"66230952ad351a3b87aa75dc"}
            />)
        cy.get('.answerText').contains(answerText)
        cy.get('.answerAuthor > .answer_author').contains(answeredBy)
        cy.get('.answerAuthor > .answer_question_meta').contains(date)
        cy.get('.answer_votes').contains('-1 votes');
        cy.get('.vote_button').first().contains('UpVote');
        cy.get('.vote_button').eq(1).contains('DownVote');
        cy.get('.delete_button').contains('Delete Answer');
        cy.get('.delete_button').click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Successfully deleted answer');
        });
        cy.get('.hidden').should('exist');

    });

});

describe("Entire Answer Page for role User", () => {
    beforeEach(
        () => {
            cy.intercept(
                'GET', 
                '/question/getQuestionById/*', 
                {
                    statusCode: 200,
                    body: question
                }
            ).as('getQuestionById');

            cy.intercept(
                'GET', 
                '/user/getCurrentUser', 
                {
                    statusCode: 200,
                    body: regularUser
                }
            ).as('getCurrentUser');

            cy.intercept(
                'POST',
                '/reportedPost/reportPost',
                {
                    statusCode: 200,
                }
            )

            cy.intercept(
                'POST',
                '/question/deleteQuestion',
                {
                    statusCode: 200,
                }
            )
        }
    );

    it('Answer Page should have all the components, check all button clicks', () => {
        const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy');
        const handleNewAnswerSpy = cy.spy().as('handleNewAnswerSpy');
        cy.mount(<AnswerPage qid={question._id} 
                    handleNewQuestion={handleNewQuestionSpy} 
                    handleNewAnswer={handleNewAnswerSpy}
                />);
        cy.get('.bold_title').contains(question.answers.length + " answers");
        cy.get('.answer_question_title').contains(question.title);
        cy.get('.bluebtn').contains('Ask a Question').click();
        cy.get('@handleNewQuestionSpy').should('have.been.called');
        
        cy.get('.delete_button').contains('Report Question').click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Successfully reported post');
        });

        cy.get('.answer_question_text > div').contains(question.text)
        cy.get('.answer_question_view').contains(question.views + ' views')
        cy.get('.answer_question_right > .question_author').contains(question.asked_by)


        cy.get('.answerText')
        .eq(0)
        .find('div')
        .should('have.text', answers[0].text);
        cy.get('.answerAuthor > .answer_author').eq(0).should('have.text', answers[0].ans_by)

        cy.get('.answerText')
        .eq(1) 
        .find('div')
        .should('have.text', answers[1].text);
        cy.get('.answerAuthor > .answer_author').eq(0).should('have.text', answers[0].ans_by)

        cy.get('.answerText')
        .eq(2) 
        .find('div')
        .should('have.text', answers[2].text);
        cy.get('.answerAuthor > .answer_author').eq(0).should('have.text', answers[0].ans_by)

        cy.get('.bluebtn').contains('Answer Question').click();
        cy.get('@handleNewAnswerSpy').should('have.been.called');
    });
});

describe("Entire Answer Page for role Moderator", () => {
    beforeEach(
        () => {
            cy.intercept(
                'GET', 
                '/question/getQuestionById/*', 
                {
                    statusCode: 200,
                    body: question
                }
            ).as('getQuestionById');

            cy.intercept(
                'GET', 
                '/user/getCurrentUser', 
                {
                    statusCode: 200,
                    body: modUser
                }
            ).as('getCurrentUser');

            cy.intercept(
                'POST',
                '/reportedPost/reportPost',
                {
                    statusCode: 200,
                }
            ).as('reportPost');

            cy.intercept(
                'POST',
                '/question/deleteQuestion',
                {
                    statusCode: 200,
                }
            ).as('deleteQuestion');

            cy.intercept(
                'POST', 
                '/answer/deleteAnswer', 
                {
                    statusCode: 200,
                    body: { 
                        message: 'Answers deleted successfully.' 
                    }
                }
            ).as('deleteAnswer');
        }
    );

    it('Answer Page should have all the components, check all button clicks', () => {
        cy.viewport(1536, 960);
        const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy');
        const handleNewAnswerSpy = cy.spy().as('handleNewAnswerSpy');
        const usableReloadWindowSpy = cy.spy().as('reloadStub');
        cy.mount(<AnswerPage qid={question._id} 
                    handleNewQuestion={handleNewQuestionSpy} 
                    handleNewAnswer={handleNewAnswerSpy}
                    usableReloadWindow={usableReloadWindowSpy}
                />);
        cy.get('.bold_title').contains(question.answers.length + " answers");
        cy.get('.answer_question_title').contains(question.title);
        cy.get('.bluebtn').contains('Ask a Question').click();
        cy.get('@handleNewQuestionSpy').should('have.been.called');
        
        cy.get('.delete_button').contains('Report Question').click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Successfully reported post');
        });

        cy.get('.answer_question_text > div').contains(question.text)
        cy.get('.answer_question_view').contains(question.views + ' views')
        cy.get('.answer_question_right > .question_author').contains(question.asked_by)

        cy.get('.answerText').should('have.length', 3);

        cy.get('.answerText')
        .eq(0)
        .find('div')
        .should('have.text', answers[0].text);
        cy.get('.answerAuthor > .answer_author').eq(0).should('have.text', answers[0].ans_by)

        cy.get('.answerText')
        .eq(1) 
        .find('div')
        .should('have.text', answers[1].text);
        cy.get('.answerAuthor > .answer_author').eq(0).should('have.text', answers[0].ans_by)

        cy.get('.answerText')
        .eq(2) 
        .find('div')
        .should('have.text', answers[2].text);
        cy.get('.answerAuthor > .answer_author').eq(0).should('have.text', answers[0].ans_by)

        cy.get('.bluebtn').contains('Answer Question').click();
        cy.get('@handleNewAnswerSpy').should('have.been.called');
    });

    it('Check for delete question button', () => {
        cy.viewport(1536, 960);
        const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy');
        const handleNewAnswerSpy = cy.spy().as('handleNewAnswerSpy');
        const usableReloadWindowSpy = cy.spy().as('reloadStub');
        cy.mount(<AnswerPage qid={question._id} 
                    handleNewQuestion={handleNewQuestionSpy} 
                    handleNewAnswer={handleNewAnswerSpy}
                    usableReloadWindow={usableReloadWindowSpy}
                />);

        cy.get('#delete_question').click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Successfully deleted question and all related answers');
        });
    });
});