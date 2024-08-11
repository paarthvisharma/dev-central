import ModerationPage from "../../src/components/main/moderationPage";
import ModerationHeader from "../../src/components/main/moderationPage/header";

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

it('Rendering Moderation Header', () => {
    const title = 'Sample Title'
    const qcnt = 1
    cy.mount(<ModerationHeader 
        title_text={title} 
        qcnt={qcnt}/>);
    cy.get('.bold_title').contains(title);
    cy.get('#question_count').contains(qcnt + ' questions');
});

describe('Moderation Page', () => {
    beforeEach(() => {
        cy.intercept(
            'GET', 
            '/reportedPost/getReportedPosts', 
            { 
                body: questions
            }
        ).as('getReportedPosts');
        cy.intercept(
            'POST', 
            '/reportedPost/deleteReportedPost', 
            { 
                statusCode: 200,
                body: { 
                    message: 'Resolved Successfully' 
                }
            }
        ).as('resolveReportedPost');
    });
    
    it('Rendering Moderation Page', () => {
        const clickTagSpy = cy.spy().as('clickTagSpy');
        const handleAnswerSpy = cy.spy().as('handleAnswerSpy');
        cy.mount(<ModerationPage 
            clickTag={clickTagSpy}
            handleAnswer={handleAnswerSpy}/>);
        cy.wait('@getReportedPosts');
        cy.get('.bold_title').contains("Moderation Page");
        cy.get('#question_count').contains(questions.length + ' questions');
        cy.get('.question_list').children().should('have.length', questions.length);
        cy.get('.resolved_button').click();
        cy.wait('@resolveReportedPost');
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Resolved Successfully');
        });
    });
});
