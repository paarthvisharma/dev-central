describe('Home Page 1', () => {
  it('successfully shows All Questions string', () => {
      cy.visit('http://localhost:3000');
      cy.contains('All Questions');
  })
})

describe('Home Page 2', () => {
  it('successfully shows Ask a Question button', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Ask a Question');
  })
})

describe('Home Page 3', () => {
  it('successfully shows total questions number', () => {
      cy.visit('http://localhost:3000');
      cy.contains('4 questions');
  })
})

describe('Home Page 4', () => {
  it('successfully shows filter buttons', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Newest');
      cy.contains('Active');
      cy.contains('Unanswered');
  })
})

describe ('Home Page 5', () => {
  it('successfully shows menu items', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Questions');
      cy.contains('Tags');
  })
})

describe ('Home Page 6', () => {
  it('successfully shows search bar', () => {
      cy.visit('http://localhost:3000');
      cy.get('#searchBar');
  })
})

describe('Home Page 7', () => {
  it('successfully shows page title', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Fake Stack Overflow');
  })
})

describe('Home Page 8', () => {
  it('successfully shows all questions in model', () => {
      const qTitles = ['Quick question about storage on android','Object storage for a web application','android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
      cy.visit('http://localhost:3000');
      cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles[index]);
      })
  })
})

describe('Home Page 9', () => {
  it('successfully shows all question stats', () => { 
      cy.exec(
          "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
          "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
          .then((result) => {
          console.log('Command executed successfully:', result.stdout);
  });
      const answers = ['1 answers','2 answers','3 answers','2 answers'];
      const views = ['103 views', '200 views', '121 views','10 views'];
      cy.visit('http://localhost:3000');
      cy.get('.postStats').each(($el, index, $list) => {
          cy.wrap($el).should('contain', answers[index]);
          cy.wrap($el).should('contain', views[index]);
      })
  })
})

describe('Home Page 10', () => {
  it('successfully shows all question authors and date time', () => {
      const authors = ['elephantCDE', 'monkeyABC', 'saltyPeter', 'Joji John'];
      const date = ['Mar 10','Feb 18','Jan 10', 'Jan 20'];
      const times = ['14:28:01', '01:02:15', '11:24:30', '03:00:00'];
      cy.visit('http://localhost:3000');
      cy.get('.lastActivity').each(($el, index, $list) => {
          cy.wrap($el).should('contain', authors[index]);
          cy.wrap($el).should('contain', date[index]);
          cy.wrap($el).should('contain', times[index]);
      })
  })
})

describe('Home Page 11', () => {
  it('successfully shows all questions in model in active order', () => {
      const qTitles = ['Programmatically navigate using React router','android studio save string shared preference, start activity and load the saved string', 'Quick question about storage on android', 'Object storage for a web application'];
      cy.visit('http://localhost:3000');
      cy.contains('Active').click();
      cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles[index]);
      })
  })
})

describe('Home Page 12', () => {
  it('successfully shows all unanswered questions in model', () => {
      const qTitles = ['android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
      cy.visit('http://localhost:3000');
      cy.contains('Unanswered').click();
      cy.contains('0 questions');
  })
})

describe('Home Page 13', () => {
  it('successfully highlights "Questions" link when on the home page', () => {
      cy.visit('http://localhost:3000');
      cy.get('.sideBarNav').contains('Questions').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })
})

describe('Home Page 14', () => {
  it('successfully highlights "Tags" link when on the Tags page', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Tags').click();
      cy.get('.sideBarNav').contains('Tags').should('have.css', 'background-color', 'rgb(204, 204, 204)');
  })
})

describe('Home Page 15', () => {
  it('successfully verifies if login button exists', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Login');
      cy.get('.profileButton').contains('Login').should('have.css', 'background-color', 'rgb(48, 144, 226)');
  })
})

describe('Home Page 16', () => {
  it('simulate logging in wth moderator account, verify side navigation has working moderator page ', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login').click();
    cy.get('#usernameInput').type('mod');
    cy.get('#passwordInput').type('mod');
    cy.get("button#loginButton").eq(1).click();
    cy.contains('Fake Stack Overflow');
    cy.get('.sideBarNav').contains('Moderator');
    cy.get('.profileButton').contains('Moderator');
    
  })
})