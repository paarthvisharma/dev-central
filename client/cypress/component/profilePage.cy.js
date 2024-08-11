import ProfilePage from '../../src/components/main/profilePage'

describe('Profile Page Component checking', () => {
    it("Verify that the profile page is rendered", () => {
        cy.intercept(
            "GET",
            "/user/getCurrentUser",
            {
                statusCode: 200,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user']
                }
            }
        );
        cy.mount(<ProfilePage />);
        cy.get("#username").should("exist");
        cy.get("#first_name").should("exist");
        cy.get("#last_name").should("exist");
        cy.get("#roles").should("exist");
        cy.get('#passwordInput').should('exist');
        cy.get('#modifyButton').should('exist');

    });

    it("Verify the profile page for role moderator", () => {
        cy.intercept(
            "GET",
            "/user/getCurrentUser",
            {
                statusCode: 200,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user', 'moderator']
                }
            }
        );
        cy.mount(<ProfilePage />);
        cy.get("#username").contains("testuser");
        cy.get("#first_name").contains("Test");
        cy.get("#last_name").contains("User");
        cy.get("#roles").contains("user, moderator");
    });

    it("Verify the profile page for role user", () => {
        cy.intercept(
            "GET",
            "/user/getCurrentUser",
            {
                statusCode: 200,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user']
                }
            }
        );
        cy.mount(<ProfilePage />);
        cy.get("#username").contains("testuser");
        cy.get("#first_name").contains("Test");
        cy.get("#last_name").contains("User");
        cy.get("#roles").contains("user");
    });

    it("Modifying user password", () => {
        cy.intercept(
            "GET",
            "/user/getCurrentUser",
            {
                statusCode: 200,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user']
                }
            }
        );
        cy.intercept(
            "PUT",
            "/user/modifyUser",
            {
                statusCode: 201,
                body: {
                    username: 'testuser',
                    first_name: 'Test',
                    last_name: 'User',
                    roles: ['user']
                }
            }
        ).as("modifyUserAPICall");
        cy.mount(<ProfilePage />);
        cy.get("#username").contains("testuser");
        cy.get("#first_name").contains("Test");
        cy.get("#last_name").contains("User");
        cy.get("#roles").contains("user");
        cy.get('#passwordInput').type('newPassword');
        cy.get('#modifyButton').click();
        cy.wait('@modifyUserAPICall');
        cy.get('@modifyUserAPICall').then((interception) => {
            expect(interception.request.body).to.have.property('password', 'newPassword');
        });
    });
});
