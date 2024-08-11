describe('Login Page Tests ', () => {
it('verify login page page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login');
    cy.contains('Login').click();
    cy.get('#loginPage').should('contain', 'Username')
    cy.get('#loginPage').should('contain', 'Password')
    cy.get("button#loginButton").should('contain', 'Login')
    cy.get('#signupButton').should('contain', 'Sign Up')
})

it('successfully login and verify username is dispalyed on top', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#usernameInput').type('user1');
    cy.get('#passwordInput').type('password1');
    cy.get("button#loginButton").eq(1).click();
    cy.contains('Fake Stack Overflow');
    cy.contains('User');
    cy.contains('Logout');
})

it('login with wrong credentials', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#usernameInput').type('nonExistentUser');
    cy.get('#passwordInput').type('testpassword');
    const stub = cy.stub();
    cy.on('window:alert', stub);
    cy.get('button#loginButton').eq(1).click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Invalid username or password');
    });
    

})

it('successfully login, logout and verify next page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#usernameInput').type('user1');
    cy.get('#passwordInput').type('password1');
    cy.get("button#loginButton").eq(1).click();
    cy.contains('Fake Stack Overflow');
    cy.contains('User');
    cy.contains('Logout');
    cy.contains('Logout').click();
    cy.contains('Fake Stack Overflow');
    cy.contains('Login');

})

})