describe('All Tags 1', () => {
    it('Total Tag Count', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.contains('All Tags');
        cy.contains('7 Tags');
        cy.contains('Ask a Question');
    })
})

describe('All Tags 2', () => {
    it('Tag names and count', () => {
        const tagNames = ['react', 'javascript', 'android-studio', 'shared-preferences', 'storage', 'website', 'Flutter'];
        const tagCounts = ['1 question', '2 questions', '2 questions', '2 questions', '2 question', '1 question', '0 question'];
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.get('.tagNode').each(($el, index, $list) => {
            cy.wrap($el).should('contain', tagNames[index]);
            cy.wrap($el).should('contain', tagCounts[index]);
        })
    })
})

describe('All Tags 3', () => {
    it('Click Tag Name', () => {
        cy.exec(
            "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
            "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
            .then((result) => {
            console.log('Command executed successfully:', result.stdout);
    });
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('Programmatically navigate using React router');
        cy.contains('2 answers');
        cy.contains('10 views');
        cy.contains('Joji John' );
        cy.contains('Jan 20');
        cy.contains('03:00:00');
        
    })
})