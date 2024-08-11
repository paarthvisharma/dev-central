describe('Answer Page 1', () => {
    it('Answer Page displays expected header', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#answersHeader').should('contain', 'Programmatically navigate using React router');
        cy.get('#answersHeader').should('contain', '2 answers');
        cy.get('#answersHeader').should('contain', 'Ask a Question');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
    })
})

describe('Answer Page 2', () => {
    it('Answer Page displays expected question text', () => {
        cy.exec(
            "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
            "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
            .then((result) => {
            console.log('Command executed successfully:', result.stdout);
    });
        
        const text2 = 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.';
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#questionBody').should('contain', '11 views');
        cy.get('#questionBody').should('contain', text2);
        cy.get('#questionBody').should('contain', 'Joji John');
        cy.get('#questionBody').should('contain', 'Jan 20, 2022');
        cy.get('#questionBody').should('contain', '3:00:00');
    })
})

describe('Answer Page 3', () => {
    it('Answer Page displays expected answers', () => {
        const answers = ["React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
    });
});

describe('Answer Page 4', () => {
    it('Answer Page displays expected authors', () => {
        const authors = ['hamkalo', 'azad'];
        const date = ['Nov 20','Nov 23'];
        const times = ['03:24:42','08:24:00'];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerAuthor').each(($el, index) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);
        });
    });
});

describe('Answer Page 5', () => {
    it('should display alert if user is not logged in and tries to vote', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Programmatically navigate using React router').click();
      const stub = cy.stub();
      cy.on('window:alert', stub);
      cy.get('.vote_button').first().should('contain', 'UpVote');
      cy.get('.vote_button').last().should('contain', 'DownVote');

      cy.get('.vote_button').first().click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Please login to vote');
        });
  
      cy.get('.vote_button').last().click()
        .then(() => {
          expect(stub.getCall(1)).to.be.calledWith('Please login to vote');
        });
    });
  });

  describe('Answer Page 6', () => {
    it('should vote when logged in and throw error when try to vote again', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Login').click();
      cy.get('#usernameInput').type('user1');
      cy.get('#passwordInput').type('password1');
      cy.get("button#loginButton").eq(1).click();

      cy.contains('Programmatically navigate using React router').click();

      const answers = ["React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
      const stub = cy.stub();
      cy.on('window:alert', stub);
      cy.get('.answerText').each(($el, index) => {
      if ($el.text().includes(answers[index])) {
          cy.wrap($el).parent().find('.vote_button').contains('UpVote').click();
          cy.wrap($el).parent().find('.answer_votes').contains('1 votes');
          cy.wrap($el).parent().find('.vote_button').contains('DownVote').click()
          .then(() => {
            expect(stub.getCall(0)).to.be.calledWith("You have already voted on this answer.");
        });
    }
  });
});
});