import Header from '../../src/components/header';

import { useState } from 'react';

const setContentSelector = (content) => {
    return content;
};

const userDetails = {
    first_name: 'Test', 
    last_name: 'User', 
    username: 'testuser', 
    roles: ['user']
};

const HeaderWrapper = ({ search, setQuesitonPage, setContentSelector, userDetails, usableReloadWindow=() => {} }) => {

    const [currentUser, setCurrentUser] = useState(userDetails);

    const userInfo = {
        getter: currentUser,
        setter: setCurrentUser
    };


    return (
        <Header 
            search={search}
            setQuesitonPage={setQuesitonPage}
            userInfo={userInfo}
            setContentSelector={setContentSelector}
            usableReloadWindow={usableReloadWindow}
        />
    );
};


it('header shows search bar and title', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = ''
    const title = 'Fake Stack Overflow'
    cy.mount(<HeaderWrapper 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}
                userDetails={userDetails}
                setContentSelector={setContentSelector}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder')
    cy.get('.title').contains(title)
})

it('search bar shows search text entered by user', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<HeaderWrapper 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}
                userDetails={userDetails}
                setContentSelector={setContentSelector}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder');
    cy.get('#searchBar').clear()
    cy.get('#searchBar').type('Search change')
    cy.get('#searchBar').should('have.value', 'Search change')
})

it('set question page called when enter is pressed in search', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<HeaderWrapper 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}
                userDetails={userDetails}
                setContentSelector={setContentSelector}/>)
    cy.get('#searchBar').type('{enter}')
    cy.get('@setQuesitonPageSpy').should('have.been.calledWith', searchQuery, 'Search Results')
})

it('profile button shows user name when logged in', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy');
    const searchQuery = '';
    cy.mount(<HeaderWrapper 
        search={searchQuery} 
        setQuesitonPage={setQuesitonPageSpy}
        userDetails={userDetails}
        setContentSelector={setContentSelector}/>)
    cy.get('#profileButton').should('contain', 'Test');
    cy.get('#logoutButton').should('contain', 'Logout');
})

it('login button shows when no user is logged in', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy');
    const searchQuery = '';
    cy.mount(<HeaderWrapper 
        search={searchQuery} 
        setQuesitonPage={setQuesitonPageSpy}
        userDetails={null}
        setContentSelector={setContentSelector}/>)
    cy.get('#loginButton').should('contain', 'Login');
})

it('updates userInfo based on local storage', () => {
    localStorage.setItem('currentUser', JSON.stringify({ first_name: 'Alice' }));
    cy.mount(<HeaderWrapper setContentSelector={setContentSelector} userDetails={{ first_name: 'Alice' }} />);
    cy.get('#profileButton').should('contain', 'Alice');
    localStorage.removeItem('currentUser');
});


it('clears user info and local storage on logout', () => {
    cy.intercept('POST', '/user/logout', {
        statusCode: 200,
        body: { success: true}
    }).as('logoutUser');
    localStorage.setItem('currentUser', JSON.stringify({ first_name: 'Alice' }));
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy');
    const usableReloadWindowSpy = cy.spy().as('reloadStub');
    cy.mount(<HeaderWrapper userDetails={{ first_name: 'Alice' }} 
                setContentSelector={setContentSelector} 
                setQuesitonPage={setQuesitonPageSpy} search={''}
                usableReloadWindow={usableReloadWindowSpy}/>);
    cy.get('#logoutButton').click();
    cy.wait('@logoutUser');
    cy.get('@reloadStub').should('be.called');
    cy.get('#loginButton').should('exist');
});

it('changes content to mainContent when title is clicked', () => {
    cy.viewport(1536, 960);
    const setContentSpy = cy.spy().as('setContentSpy');
    cy.mount(<HeaderWrapper setContentSelector={setContentSpy} userDetails={null} />);
    cy.get('.title').click();
    cy.get('@setContentSpy').should('have.been.calledWith', 'mainContent');
});

it('changes content to profileContent when profile button is clicked', () => {
    cy.viewport(1536, 960);
    const setContentSpy = cy.spy().as('setContentSpy');
    cy.mount(<HeaderWrapper setContentSelector={setContentSpy} userDetails={userDetails} />);
    cy.get('#profileButton').click();
    cy.get('@setContentSpy').should('have.been.calledWith', 'profileContent');
});

it('displays appropriate buttons based on user login state', () => {
    cy.mount(<HeaderWrapper setContentSelector={setContentSelector} userDetails={userDetails} />);
    cy.get('#logoutButton').should('exist');
    cy.get('#loginButton').should('not.exist');

    cy.mount(<HeaderWrapper setContentSelector={setContentSelector} userDetails={null} />);
    cy.get('#loginButton').should('exist');
    cy.get('#logoutButton').should('not.exist');
});

it('display error as alert when logout fails', () => {
    cy.intercept('POST', '/user/logout', {
        body: { success: false }
    }).as('logoutUser');
    localStorage.setItem('currentUser', JSON.stringify(userDetails));
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy');
    const usableReloadWindowSpy = cy.spy().as('reloadStub');
    cy.mount(<HeaderWrapper userDetails={{ first_name: 'Alice' }} 
                setContentSelector={setContentSelector} 
                setQuesitonPage={setQuesitonPageSpy} search={''}
                usableReloadWindow={usableReloadWindowSpy}/>);
    cy.get('#logoutButton').click();
    // cy.wait('@logoutUser');
    cy.on('window:alert', (text) => {
        expect(text).to.equal('An error occurred while logging out');
    });
});