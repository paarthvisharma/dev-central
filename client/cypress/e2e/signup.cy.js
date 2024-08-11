describe('Sign up Page 1', () => {
    it('navigate to signup page page', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login');
        cy.contains('Login').click();
        cy.get('#signupButton').should('contain', 'Sign Up')
    })

    it('successfully signup', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Login').click();
      cy.contains('Sign Up').click();
      cy.get('#usernameInput').type('testuser');
      cy.get('#passwordInput').type('testpassword');
      cy.get('#fistNameInput').type('TestFirstName');
      cy.get('#lastNameInput').type('TestLastName');
      cy.contains('Sign Up').click();
    })
  
    it('signing up the same user again, waring displayed', () => {
        cy.visit('http://localhost:3000');
        const stub = cy.stub();
        cy.on('window:alert', stub);
        cy.contains('Login').click();
        cy.contains('Sign Up').click();
        cy.get('#usernameInput').type('testuser');
        cy.get('#passwordInput').type('testpassword');
        cy.get('#fistNameInput').type('TestFirstName');
        cy.get('#lastNameInput').type('TestLastName');
        cy.contains('Sign Up').click();
        cy.get('#signupButton').first().click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('User with username already exists. Try a different username');
        });
      })

      it('signing up with no username, warning displayed', () => {
        cy.visit('http://localhost:3000');
        const stub = cy.stub();
        cy.on('window:alert', stub);
        cy.contains('Login').click();
        cy.contains('Sign Up').click();
        cy.get('#passwordInput').type('testpassword');
        cy.get('#fistNameInput').type('TestFirstName');
        cy.get('#lastNameInput').type('TestLastName');
        cy.contains('Sign Up').click();
        cy.get('#signupButton').first().click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWithMatch("Username must be between 1 and 30 characters\n");
        });
      })

      it('signing up with no password, warning displayed', () => {
        cy.visit('http://localhost:3000');
        const stub = cy.stub();
        cy.on('window:alert', stub);
        cy.contains('Login').click();
        cy.contains('Sign Up').click();
        cy.get('#usernameInput').type('testuser');
        cy.get('#fistNameInput').type('TestFirstName');
        cy.get('#lastNameInput').type('TestLastName');
        cy.contains('Sign Up').click();
        cy.get('#signupButton').first().click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWithMatch("Password must be between 1 and 30 characters\n");
        });
      })

      it('signing up with no first name, warning displayed', () => {
        cy.visit('http://localhost:3000');
        const stub = cy.stub();
        cy.on('window:alert', stub);
        cy.contains('Login').click();
        cy.contains('Sign Up').click();
        cy.get('#usernameInput').type('testuser');
        cy.get('#lastNameInput').type('TestLastName')
        cy.get('#passwordInput').type('testpassword');
        cy.contains('Sign Up').click();
        cy.get('#signupButton').first().click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWithMatch("First Name must is mandatory\n");
        });
      })

      it('signing up with no last name, warning displayed', () => {
        cy.visit('http://localhost:3000');
        const stub = cy.stub();
        cy.on('window:alert', stub);
        cy.contains('Login').click();
        cy.contains('Sign Up').click();
        cy.get('#usernameInput').type('testuser');
        cy.get('#fistNameInput').type('TestFirstName');
        cy.get('#passwordInput').type('testpassword');
        cy.contains('Sign Up').click();
        cy.get('#signupButton').first().click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWithMatch("Last Name must is mandatory\n");
        });
      })
});
