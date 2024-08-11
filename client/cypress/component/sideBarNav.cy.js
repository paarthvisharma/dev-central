import SideBarNav from "../../src/components/main/sideBarNav";

describe('SideBarNav Component test for role user', () => {
    beforeEach(() => {
        cy.intercept(
            "GET",
            "/user/getCurrentUser",
            {
                statusCode: 200,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user']
                }
            }
        ).as("getCurrentUser");
    });

    it ('Rendering SideBarNav Component', () => {
        const handleQuestionsSpy = cy.spy().as('handleQuestions');
        const handleTagsSpy = cy.spy().as('handleTags');
        const handleModerationSpy = cy.spy().as('handleModeration'); 
        cy.mount(<SideBarNav 
                    handleQuestions={handleQuestionsSpy}
                    handleTags={handleTagsSpy}
                    handleModeration={handleModerationSpy}/>);
        cy.wait('@getCurrentUser');
        cy.get('#sideBarNav').should('exist');
        cy.get('#menu_question').should('exist');
        cy.get('#menu_tag').should('exist');
        cy.get('#menu_moderation').should('not.exist');
    });
});

describe('SideBarNav Component test for role moderator', () => {
    beforeEach(() => {
        cy.intercept(
            "GET",
            "/user/getCurrentUser",
            {
                statusCode: 200,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user', 'moderator']
                }
            }
        ).as("getCurrentUser");
    });

    it('Rendering SideBarNav Component', () => {
        const handleQuestionsSpy = cy.spy().as('handleQuestions');
        const handleTagsSpy = cy.spy().as('handleTags');
        const handleModerationSpy = cy.spy().as('handleModeration'); 
        cy.mount(<SideBarNav 
                    handleQuestions={handleQuestionsSpy}
                    handleTags={handleTagsSpy}
                    handleModeration={handleModerationSpy}/>);
        cy.wait('@getCurrentUser');
        cy.get('#sideBarNav').should('exist');
        cy.get('#menu_question').should('exist');
        cy.get('#menu_tag').should('exist');
        cy.get('#menu_moderation').should('exist');
    });

    it('Clicking on moderation menu item', () => {
        const handleQuestionsSpy = cy.spy().as('handleQuestions');
        const handleTagsSpy = cy.spy().as('handleTags');
        const handleModerationSpy = cy.spy().as('handleModeration'); 
        cy.mount(<SideBarNav 
                    selected="m"
                    handleQuestions={handleQuestionsSpy}
                    handleTags={handleTagsSpy}
                    handleModeration={handleModerationSpy}/>);
        cy.wait('@getCurrentUser');
        cy.get('#menu_moderation').click();
        cy.get('@handleModeration').should('have.been.calledOnce');
        cy.get('#menu_moderation').should('have.class', 'menu_selected');
    });

    it('Clicking on tags menu item', () => {
        const handleQuestionsSpy = cy.spy().as('handleQuestions');
        const handleTagsSpy = cy.spy().as('handleTags');
        const handleModerationSpy = cy.spy().as('handleModeration'); 
        cy.mount(<SideBarNav 
                    selected="t"
                    handleQuestions={handleQuestionsSpy}
                    handleTags={handleTagsSpy}
                    handleModeration={handleModerationSpy}/>);
        cy.wait('@getCurrentUser');
        cy.get('#menu_tag').click();
        cy.get('@handleTags').should('have.been.calledOnce');
        cy.get('#menu_tag').should('have.class', 'menu_selected');
    });

    it('Clicking on tags menu item', () => {
        const handleQuestionsSpy = cy.spy().as('handleQuestions');
        const handleTagsSpy = cy.spy().as('handleTags');
        const handleModerationSpy = cy.spy().as('handleModeration'); 
        cy.mount(<SideBarNav 
                    selected="q"
                    handleQuestions={handleQuestionsSpy}
                    handleTags={handleTagsSpy}
                    handleModeration={handleModerationSpy}/>);
        cy.wait('@getCurrentUser');
        cy.get('#menu_question').click();
        cy.get('@handleQuestions').should('have.been.calledOnce');
        cy.get('#menu_question').should('have.class', 'menu_selected');
    });
});