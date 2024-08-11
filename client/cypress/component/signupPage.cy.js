import SignupPage from '../../src/components/main/signupPage';

const newValidUser = {
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    password: 'password'
}

const invalidUser = {
    username: 'testuser',
    password: 'password'

}

describe('Signup Page Component checking', () => {
    beforeEach(() => {
        cy.intercept(
            'POST', 
            '/user/signUp', 
            {
                statusCode: 200,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user']
                }
            }
        ).as('validSignup');
    });

    it("Verify that the signup page is rendered", () => {
        const setContentSelectorStub = cy.stub().as('setContentSelectorStub');
        cy.mount(<SignupPage setContentSelector={setContentSelectorStub}/>);
        cy.get("#usernameInput").should("exist");
        cy.get("#fistNameInput").should("exist");
        cy.get("#lastNameInput").should("exist");
        cy.get("#passwordInput").should("exist");
        cy.get('#signupButton').should('exist');
    });

    it("Verify that signup works with valid input", () => {
        const setContentSelectorStub = cy.stub().as('setContentSelectorStub');
        cy.mount(<SignupPage setContentSelector={setContentSelectorStub}/>);
        cy.get("#usernameInput").type(newValidUser.username);
        cy.get("#fistNameInput").type(newValidUser.first_name);
        cy.get("#lastNameInput").type(newValidUser.last_name);
        cy.get("#passwordInput").type(newValidUser.password);
        cy.get('#signupButton').click();
        cy.wait('@validSignup');
        cy.get('@setContentSelectorStub').should('have.been.calledOnceWith', 'loginContent');
    });
});

describe('Signup Page tests for invalid user cred', () => {
    beforeEach(() => {
        cy.intercept(
            'POST', 
            '/user/signUp', 
            {
                statusCode: 500,
            }
        ).as('invalidSignup');
    });

    it("Verify that signup doesnt works with invalid input", () => {
        const setContentSelectorStub = cy.stub().as('setContentSelectorStub');
        cy.mount(<SignupPage setContentSelector={setContentSelectorStub}/>);
        cy.get("#usernameInput").type(newValidUser.username);
        cy.get("#passwordInput").type(newValidUser.password);
        cy.get('#signupButton').click();
        // cy.wait('@validSignup');
        cy.get('@setContentSelectorStub').should('not.have.been.called');
    });

    it("Verify that signup doesnt works with repeat input", () => {
        const setContentSelectorStub = cy.stub().as('setContentSelectorStub');
        cy.mount(<SignupPage setContentSelector={setContentSelectorStub}/>);
        cy.get("#usernameInput").type(newValidUser.username);
        cy.get("#fistNameInput").type(newValidUser.first_name);
        cy.get("#lastNameInput").type(newValidUser.last_name);
        cy.get("#passwordInput").type(newValidUser.password);
        cy.get('#signupButton').click();
        // cy.wait('@validSignup');
        cy.get('@setContentSelectorStub').should('not.have.been.called');
    });
});