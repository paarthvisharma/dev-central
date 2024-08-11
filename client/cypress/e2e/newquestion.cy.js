describe('New Question Page', () => {

    beforeEach(() => {
        cy.exec(
            "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
            "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
            .then((result) => {
            console.log('Command executed successfully:', result.stdout);
        });
    });

    it('Ask a Question creates and displays in All Questions', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        const qTitles = [
            'Test Question 1', 
            'Quick question about storage on android',
            'Object storage for a web application',
            'android studio save string shared preference, start activity and load the saved string', 
            'Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    })

    it('Ask a Question creates and displays expected meta data', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('5 questions');
        cy.contains('user1 asked 0 seconds ago');
        const answers = ['0 answers', '1 answers', '2 answers', '3 answers','2 answers'];
        const views = ['0 views', '103 views', '200 views', '121 views','10 views'];
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answers[index]);
            cy.wrap($el).should('contain', views[index]);
        });
        cy.contains('Unanswered').click();
        cy.get('.postTitle').should('have.length', 1);
        cy.contains('1 question');
    })

    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('javascript');
        cy.contains('t1');
        cy.contains('t2');
    })

    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('javascript');
        cy.contains('android-studio');
        cy.contains('t2');
    })

    it('Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be empty');
    })

    it('Ask a Question with long title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be more than 100 characters');
    })

    it('Ask a Question with empty text shows error', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Question text cannot be empty');
    })

    it('Ask a Question with more than 5 tags shows error', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('Cannot have more than 5 tags');
    })

    it('Ask a Question with a long new tag', () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("user1");
        cy.get("#passwordInput").type("password1");
        cy.get("button#loginButton").eq(1).click();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('New tag length cannot be more than 20');
    })

});