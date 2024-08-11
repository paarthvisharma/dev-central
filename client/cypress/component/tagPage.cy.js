import TagPage from "../../src/components/main/tagPage";
import Tag from "../../src/components/main/tagPage/tag";

// Tag Component
it('Rendering Tag Component', () => {
    const tag = {
        name: 'test',
        qcnt: 1
    };
    const clickTagStub = cy.stub().as('clickTag');
    cy.mount(<Tag t={tag} clickTag={clickTagStub}/>)
    cy.get('.tagNode').should('exist');
    cy.get('.tagName').should('exist');
    cy.get('#questionCount').contains('1 questions');
    cy.get('.tagNode').click();
    cy.get('@clickTag').should('have.been.calledWith', 'test');
})

// Tag Page Component
it('Rendering Tag Page Component', () => {
    const tags = [
        {
            name: 'test',
            qcnt: 1
        },
        {
            name: 'test2',
            qcnt: 2
        }
    ];
    cy.intercept(
        "GET",
        "/tag/getTagsWithQuestionNumber",
        {
            statusCode: 200,
            body: tags
        }
    ).as("getTagsWithQuestionNumber");
    const handleNewQuestionStub = cy.stub().as('handleNewQuestionStub');
    const clickTagStub = cy.stub().as('clickTagStub');
    cy.mount(<TagPage handleNewQuestion={handleNewQuestionStub} clickTag={clickTagStub}/>);
    cy.wait('@getTagsWithQuestionNumber');
    cy.get('.bold_title').contains(tags.length + ' Tags');
    cy.get('.tagNode').should('have.length', tags.length);
})