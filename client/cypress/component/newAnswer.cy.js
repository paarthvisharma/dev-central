import NewAnswer from "../../src/components/main/newAnswer";

it('mounts', () => {
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
    );
    const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
    cy.mount(<NewAnswer setContentSelector={setContentSelectorSpy}/>)
    cy.get('#answerUsernameInput')
    cy.get('#answerTextInput')
    cy.get('.form_postBtn')
});

it('shows error message when both input is empty', () => {
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
    ).as('getCurrentUser');
    const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
    cy.mount(<NewAnswer setContentSelector={setContentSelectorSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Answer text cannot be empty')
});

it('shows error message when text is empty', () => {
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
    );
    const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
    cy.mount(<NewAnswer setContentSelector={setContentSelectorSpy}/>)
    cy.get('#answerUsernameInput').type('abc')
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Answer text cannot be empty')
})

it('shows text inputted by user', () => {
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
    );
    const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
    cy.mount(<NewAnswer setContentSelector={setContentSelectorSpy}/>)
    cy.get('#answerTextInput').should('have.value', '')
    cy.get('#answerTextInput').type('abc')
    cy.get('#answerTextInput').should('have.value', 'abc')
})


it('addAnswer is called when click Post Answer', () => {
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
    ).as('getCurrentUser');
    cy.intercept(
        "POST",
        "/answer/addAnswer",
        {
            statusCode: 200,
            body: {
                _id: 123
            }
        }
    ).as('addAnswer');
    const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
    const handleAnswer = cy.spy().as('handleAnswerSpy')
    cy.mount(<NewAnswer qid={123} handleAnswer={handleAnswer} setContentSelector={setContentSelectorSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('#answerTextInput').type('abc')
    cy.get('.form_postBtn').click();
    cy.wait('@addAnswer');
    cy.get('@handleAnswerSpy').should('have.been.called');
});
