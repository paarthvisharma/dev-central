import NewQuestion from "../../src/components/main/newQuestion";

it('mounts', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput')
    cy.get('#formTextInput')
    cy.get('#formTagInput')
    cy.get('#formUsernameInput')
    cy.get('.form_postBtn')
})

it('shows title inputted by user', () => {
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.get('#formTitleInput').should('have.value', '')
    cy.get('#formTitleInput').type('abc')
    cy.get('#formTitleInput').should('have.value', 'abc')
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.get('#formTextInput').should('have.value', '')
    cy.get('#formTextInput').type('abc')
    cy.get('#formTextInput').should('have.value', 'abc')
})

it('shows tags inputted by user', () => {
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.get('#formTagInput').should('have.value', '')
    cy.get('#formTagInput').type('abc')
    cy.get('#formTagInput').should('have.value', 'abc')
})

it('shows username being loaded by default (sessions)', () => {
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('#formUsernameInput').should('have.value', 'testuser');
})

it('shows error message when inputs are empty', () => {
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('.form_postBtn').click();
    cy.get('div .input_error').contains('Title cannot be empty');
    cy.get('div .input_error').contains('Question text cannot be empty');
    cy.get('div .input_error').contains('Should have at least 1 tag');
})

it('shows error message when title is more than 100 characters', () => {
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('a'.repeat(101))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Title cannot be more than 100 characters')
})

it('shows error message when there are more than five tags', () => {
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('.form_postBtn').click();
    cy.get('#formTagInput').type('a b c d e f')
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Cannot have more than 5 tags')
})

it('shows error message when a tag is longer than 20 characters', () => {
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
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('.form_postBtn').click();
    cy.get('#formTagInput').type('a'.repeat(21))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('New tag length cannot be more than 20')
})

it('New question is asked successfully', () => {
    const question = {
        "title": "title1",
        "text": "question1",
        "asked_by": "testuser",
        "ask_date_time": "2022-01-20T08:00:00.000Z",
        "tags": ["tag1", "tag2"],
        "views": 0,
        "answers": []
      }
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
        "/question/addQuestion",
        {
            statusCode: 200,
            body: {
                "_id": "661da8c28a7a19ed0fddf220",
                "title": "title1",
                "text":  "question1",
                "asked_by": "testuser",
                "ask_date_time": "2022-01-20T08:00:00.000Z",
                "tags": ["tag1", "tag2"],
                "views": 0,
                "answers": []
              }
        }
    ).as('addQuestion');
    const setContentSelectorSpy = cy.spy().as('setContentSelector');
    const handleQuestionsSpy = cy.spy().as('handleQuestions');
    cy.mount(<NewQuestion setContentSelector={setContentSelectorSpy} handleQuestions={handleQuestionsSpy}/>)
    cy.wait('@getCurrentUser');
    cy.get('#formTitleInput').type('title1');
    cy.get('#formTextInput').type('question1');
    cy.get('#formTagInput').type('tag1 tag2');
    cy.get('.form_postBtn').click();
    cy.wait('@addQuestion');
    cy.get('@handleQuestions').should('have.been.called');
})
