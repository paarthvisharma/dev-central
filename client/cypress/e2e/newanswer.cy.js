describe('New Answer Page', () => {

    beforeEach(() => {
        cy.exec(
            "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
            "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
            .then((result) => {
            console.log('Command executed successfully:', result.stdout);
        });
    });

    it('Try to answer question without logging in', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get("#usernameInput").should('exist');
        cy.get("#passwordInput").should('exist');
    });

    it('Create new answer should be displayed at the top of the answers page', () => {
        const answers = ["Test Answer 1", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('user1');
        cy.get('#answerTextInput').type(answers[0]);
        cy.contains('Post Answer').click();
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
        cy.contains('user1');
        cy.contains('0 seconds ago');
    });

    it('Answer is mandatory when creating a new answer', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('user1');
        cy.contains('Post Answer').click();
        cy.contains('Answer text cannot be empty');
    });

    it('successfully displays the username textbox for the new answer page', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').should('exist');
    });

    it('successfully displays the answer textbox for the new answer page', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').should('exist');
    });

    it('successfully displays the UserName and Answer Text fields for the new answer page', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.contains("Username");
        cy.contains("Answer Text");
    });

    it('Create new answer should increase the count of the answers on question page', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('2 answers');
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('joym');
        cy.get('#answerTextInput').type("Test Answer 1");
        cy.contains('Post Answer').click();
        cy.contains('3 answers');
    });
});