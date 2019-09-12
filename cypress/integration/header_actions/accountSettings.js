/// <reference types="Cypress" />

xdescribe('Account settings', () => {
  context('when signed in', () => {
    beforeEach(() => {
      cy.signIn();
      cy.enableDevToggles(['User Passwords']);
      cy.visit('/');

      cy.get('[data-tooltip="User options"]').click();

      cy.contains('Account Settings').click();
    });

    it('shows account settings popup', () => {
      cy.get('.account-settings-overlay').within(() => {
        cy.get('[data-cy="account-settings-options"]').within(() => {
          cy.contains('Password').should('exist');
          cy.contains('Two-Factor Authentication').should('exist');
        });
      });
    });
  });
});
