/// <reference types="Cypress" />

xdescribe('Sign in', () => {
  context('with email', () => {
    beforeEach(() => {
      cy.enableDevToggles(['User Passwords']);

      cy.server();

      // Stop the login email from actually sending
      cy.route('POST', '**/email/sendLoginEmail', {});
      cy.route('POST', '**/auth/email/*', {
        persistentToken: Cypress.env('GLITCH_TOKEN'),
      }).as('emailLogin');
      cy.route('POST', '**/user/login*', {
        persistentToken: Cypress.env('GLITCH_TOKEN'),
      }).as('passwordLogin');

      cy.visit('/');

      cy.get('.what-is-glitch').should('exist');
    });

    it('can sign in with a code', () => {
      cy.contains('Sign in').click();
      cy.contains('Sign in with Email').click();
      cy.get('[data-cy="sign-in-email"]').type('email.olivia@glitch.com');
      cy.contains('Send Link').click();
      cy.contains('Use a sign in code').click();

      cy.get('[data-cy="sign-in-code-form"]').within(() => {
        cy.get('[data-cy="sign-in-code"]').type('sign-in-code');
        cy.contains('Sign In').click();
      });

      cy.wait('@emailLogin');

      cy.get('[data-cy="recent-projects"]').should('exist');
    });

    it('can sign in with a password', () => {
      cy.contains('Sign in').click();
      cy.get('[data-cy="sign-in-form"]').within(() => {
        cy.get('[data-cy="sign-in-email"]').type('email.olivia@glitch.com');
        cy.get('[data-cy="sign-in-password"]').type('NiceTryHackers');
        cy.contains('Sign in').click();
      });

      cy.wait('@passwordLogin');

      cy.get('[data-cy="recent-projects"]').should('exist');
    });
  });

  context('with 2FA enabled', () => {
    beforeEach(() => {
      cy.enableDevToggles(['User Passwords']);

      cy.server();

      cy.route('POST', '**/user/login*', {
        tfaToken: 'TwoFactorAuthToken',
      }).as('passwordLogin');
      const options = {
        method: 'POST',
        url: '**/user/tfa/verifyCode*',
        onRequest: (xhr) => {
          assert.isNotNull(xhr.request.body.data, {
            code: '123456',
            token: 'TwoFactorAuthToken',
          });
        },
        response: {
          persistentToken: Cypress.env('GLITCH_TOKEN'),
        },
      };
      cy.route('POST', '**/user/tfa/verifyCode*', {
        persistentToken: Cypress.env('GLITCH_TOKEN'),
      }).as('verifyCode');
      cy.visit('/');

      cy.get('.what-is-glitch').should('exist');
    });

    it('can sign in', () => {
      cy.contains('Sign in').click();
      cy.get('[data-cy="sign-in-form"]').within(() => {
        cy.get('[data-cy="sign-in-email"]').type('email.olivia@glitch.com');
        cy.get('[data-cy="sign-in-password"]').type('NiceTryHackers');
        cy.contains('Sign in').click();

        cy.wait('@passwordLogin');

        cy.get('[data-cy="tfa-code"]').type('123456');
        cy.contains('Enter code').click();
      });

      cy.wait('@verifyCode');

      cy.get('[data-cy="recent-projects"]').should('exist');
    });
  });

  context('signing in with oauth', () => {
    it('suggests email sign in when provider fails to return email', () => {
      cy.server();
      cy.route({
        method: 'POST',
        url: '**/auth/facebook/fbcode?callbackURL=https://glitch.com/login/facebook',
        status: 403,
        response: { status: 403, message: 'The provider facebook did not return any email.' },
      });

      cy.visit('/login/facebook?code=fbcode');
    });
  });

  it('can sign out', () => {
    cy.signIn();

    cy.visit('/');

    cy.get('[data-cy="recent-projects"]').should('exist');

    cy.get('[data-tooltip="User options"]').click();
    cy.contains('Sign Out').click();

    cy.get('.what-is-glitch').should('exist');
  });
});
