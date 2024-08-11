describe("Moderator Page", () => {

    let reportedTitle = "";

    it("Successfully login as a moderator and check sidebar component", () => {
        cy.exec(
            "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
            "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
            .then((result) => {
            console.log('Command executed successfully:', result.stdout);
        });
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("mod");
        cy.get("#passwordInput").type("mod");
        cy.get("button#loginButton").eq(1).click();
        cy.get("#menu_moderation").contains("Moderator");
    });
    
    it("Report one question and check reported posts", () => {
        cy.exec(
            "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
            "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
            .then((result) => {
            console.log('Command executed successfully:', result.stdout);
        });
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("mod");
        cy.get("#passwordInput").type("mod");
        cy.get("button#loginButton").eq(1).click();
        cy.get(".postTitle").eq(0).then(($el) => {
            reportedTitle = $el.text();
        });
        cy.get(".postTitle").eq(0).click();
        cy.get("#report_question").click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Successfully reported post');
        });
        cy.get("#menu_moderation").click();
    });

    it("Resolve one question and check resolved posts", () => {
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("mod");
        cy.get("#passwordInput").type("mod");
        cy.get("button#loginButton").eq(1).click();
        cy.get("#menu_moderation").click();
        cy.get(".postTitle").then(($el) => {
            expect($el.text()).to.eq(reportedTitle);
        });
        cy.get(".resolved_button").should("exist");
        cy.get(".resolved_button").click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Resolved Successfully');
        });
        cy.get("#question_count").contains("0");
    });

    it("Report post and then delete a answer and then the question", () => {
        let alertTexts = [];
        cy.exec(
            "node ../server/remove_db.js mongodb://localhost:27017/fake_so;" + 
            "node ../server/populate_db.js mongodb://localhost:27017/fake_so;", { timeout: 100000 })
            .then((result) => {
            console.log('Command executed successfully:', result.stdout);
        });
        cy.on('window:alert', (text) => {
            alertTexts.push(text);
        });
        cy.visit('http://localhost:3000');
        cy.get("#loginButton").click();
        cy.get("#usernameInput").type("mod");
        cy.get("#passwordInput").type("mod");
        cy.get("button#loginButton").eq(1).click();
        cy.get(".postTitle").eq(0).then(($el) => {
            reportedTitle = $el.text();
        });
        cy.get(".postTitle").eq(0).click();
        cy.get("#report_question").click();
        cy.get("#menu_moderation").click();
        cy.get(".postTitle").eq(0).click();
        cy.get(".delete_button").contains("Delete Answer").click();
        cy.get(".answer").should("not.exist");
        cy.get("#delete_question").click();
        cy.then( () => {
                expect(alertTexts).to.contain('Successfully reported post');
                expect(alertTexts).to.contain('Successfully deleted answer');
                expect(alertTexts).to.contain('Successfully deleted question and all related answers');
            }
        )
        cy.get("#menu_moderation").click();
        cy.get("#question_count").contains("0");
    });
});
