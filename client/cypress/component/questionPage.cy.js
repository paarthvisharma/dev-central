import QuestionHeader from "../../src/components/main/questionPage/header";
import QuestionPage from "../../src/components/main/questionPage";
import Question from "../../src/components/main/questionPage/question";
import OrderButton from "../../src/components/main/questionPage/header/orderButton";


it('Rendering Question Header', () => {
    const title = 'Sample Title'
    const count = 1
    // const newQuestionButton = 'Add a new question'
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy')
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy')
    
    cy.mount(<QuestionHeader 
        title_text={title} 
        qcnt = {count}
        setQuestionOrder={setQuestionOrderSpy}
        handleNewQuestion={handleNewQuestionSpy}/>)

    cy.get('.bold_title').contains(title)
    cy.get('.bluebtn').click()
    cy.get('@handleNewQuestionSpy').should('have.been.called');
    // cy.get('@consoleLogSpy').then(consoleLogSpy => {
    //   expect(consoleLogSpy).to.have.been.calledWith(newQuestionButton);
    // });
    cy.get('#question_count').contains(count + ' questions')
    cy.get('.btns .btn').eq(0).should('have.text', 'Newest');
    cy.get('.btns .btn').eq(1).should('have.text', 'Active');
    cy.get('.btns .btn').eq(2).should('have.text', 'Unanswered');
    cy.get('.btns .btn').each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.get('@setQuestionOrderSpy').should('have.been.calledWith', $el.text());
    })
});

it('Rendering Order Button', () => {
    const message = 'Test Message';
    const setQuestionOrderSpy = cy.spy('').as('setQuestionOrderSpy');
    
    cy.mount(<OrderButton 
        message={message} 
        setQuestionOrder={setQuestionOrderSpy}/>);
     cy.get('.btn').click();
     cy.get('@setQuestionOrderSpy').should('have.been.calledWith', message);

});

const answers = [
    {
        "_id": "66255c89f5d2c0d78aeaa252",
        "text": "Answer 1",
        "ans_by": "prajwal",
        "ans_date_time": "2024-04-21T18:35:53.419Z",
        "ans_votes": 1,
        "voted_by": [
          "prajwal"
        ]
    },
    {
        "_id": "66255c89f5d2c0d78aeaa252",
        "text": "Answer 2",
        "ans_by": "sanath",
        "ans_date_time": "2023-04-21T18:35:53.419Z",
        "ans_votes": 2,
        "voted_by": [
          "prajwal",
          "sanath"
        ]
    }
];

const questions = [
    {
        "_id": "662556daf5d2c0d78aeaa24a",
        "title": "new",
        "text": "question",
        "asked_by": "prajwal",
        "ask_date_time": "2024-04-21T18:11:38.390Z",
        "views": 4,
        "answers": answers,
        "tags": [
            {
                "tid": 1,
                "name": "tag1"
            },
            {
                "tid": 2,
                "name": "tag2"
            }
        ],
      }
]

it("Rendering Question Component", () => {
    const clickTagSpy = cy.spy().as('clickTagSpy').as('clickTagSpy');
    const handleAnswerSpy = cy.spy().as('handleAnswerSpy').as('handleAnswerSpy');
    cy.mount(<Question q={questions[0]} clickTag={clickTagSpy} handleAnswer={handleAnswerSpy}/>)
    cy.get(".question").click();
    cy.get('@handleAnswerSpy').should('have.been.calledWith', questions[0]._id);
    cy.get('.postStats').contains(questions[0].answers.length + ' answers');
    cy.get('.postStats').contains(questions[0].views + ' views');
    cy.get('.postTitle').contains(questions[0].title);
    cy.get('.question_tags').children().should('have.length', questions[0].tags.length);
    cy.get('.question_tags').children().eq(0).contains(questions[0].tags[0].name);
    cy.get('.question_tags').children().eq(0).click();
    cy.get('@clickTagSpy').should('have.been.calledWith', questions[0].tags[0].name);
    cy.get('.question_tags').children().eq(1).contains(questions[0].tags[1].name);
    cy.get('.question_author').contains(questions[0].asked_by);
});

it('Rendering Question Page when questions are present', () => {
    const handleAnswerSpy = cy.spy().as('handleAnswerSpy');
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy');
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy');
    const clickTagSpy = cy.spy().as('clickTagSpy');
    const title_text = 'All Questions';
    const order = 'newest';
    const search = '';
    cy.intercept(
        'GET', 
        '/question/getQuestion*', 
        {
            statusCode: 200,
            body: questions
        }
    ).as('getQuestionsByFilter');
    cy.mount(<QuestionPage
        title_text={title_text}
        order={order}
        search={search}
        setQuestionOrder={setQuestionOrderSpy}
        clickTag={clickTagSpy}
        handleAnswer={handleAnswerSpy}
        handleNewQuestion={handleNewQuestionSpy}/>);
    cy.wait('@getQuestionsByFilter');
    cy.get(".question_list").children().should('have.length', questions.length);
});

it('Rendering Question Page when questions are not present', () => {
    const handleAnswerSpy = cy.spy().as('handleAnswerSpy');
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy');
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy');
    const clickTagSpy = cy.spy().as('clickTagSpy');
    const title_text = 'All Questions';
    const order = 'newest';
    const search = '';
    cy.intercept(
        'GET', 
        '/question/getQuestion*', 
        {
            statusCode: 200,
            body: []
        }
    ).as('getQuestionsByFilter');
    cy.mount(<QuestionPage
        title_text={title_text}
        order={order}
        search={search}
        setQuestionOrder={setQuestionOrderSpy}
        clickTag={clickTagSpy}
        handleAnswer={handleAnswerSpy}
        handleNewQuestion={handleNewQuestionSpy}/>);
    cy.wait('@getQuestionsByFilter');
    cy.get(".question_list").children().should('have.length', 0);
});
