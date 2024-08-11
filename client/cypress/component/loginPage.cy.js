import LoginPage from "../../src/components/main/loginPage";

describe('Check all login page fields', () => {

    it('Check login page fields', () => {
        const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
        const userInfo = {setter: cy.stub()};
        const submitLoginSpy = cy.stub().as("submitLoginSpy");
        const signupClickSpy = cy.stub().as("signupClickSpy");
        cy.mount(<LoginPage setContentSelector={setContentSelectorSpy} userInfo={userInfo}
                    submitLogin={submitLoginSpy} signupClick={signupClickSpy}/>);
        cy.get("#usernameInput").should("exist");
        cy.get("#passwordInput").should("exist");
        cy.get("#loginButton").should("exist");
        cy.get('#signupButton').should('exist');
    });

    it('Check login button click', () => {
        const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
        const userInfo = {setter: cy.stub()};
        const submitLoginSpy = cy.stub().as("submitLoginSpy");
        const signupClickSpy = cy.stub().as("signupClickSpy");
        cy.mount(<LoginPage setContentSelector={setContentSelectorSpy} userInfo={userInfo}
                    submitLogin={submitLoginSpy} signupClick={signupClickSpy}/>);
        cy.get("#loginButton").click();
        cy.get("@submitLoginSpy").should("have.been.called");
    });

    it('Check signup button click', () => {
        const setContentSelectorSpy = cy.spy().as('setContentSelectorSpy');
        const userInfo = {setter: cy.stub()};
        const submitLoginSpy = cy.stub().as("submitLoginSpy");
        const signupClickSpy = cy.stub().as("signupClickSpy");
        cy.mount(<LoginPage setContentSelector={setContentSelectorSpy} userInfo={userInfo}
                    submitLogin={submitLoginSpy} signupClick={signupClickSpy}/>);
        cy.get("#signupButton").click();
        cy.get("@signupClickSpy").should("have.been.called");
    });
});