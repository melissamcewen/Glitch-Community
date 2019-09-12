/// <reference types="Cypress" />

import { itemsResponse, keyByValueResponse } from '../../support/util';
import { makeTestProject, makeTestUser, makeTestCollection } from '../../support/data';

import times from 'lodash/times';

const featuredProject = makeTestProject({
  id: 'featured-project-id',
  domain: 'hello-webpage',
  description: 'I will be featured and unfeatured, and my domain _has_ to be "hello-webpage"',
});

const pinnedProject = makeTestProject({
  id: 'pinned-project-id',
  domain: 'pinned-project',
  description: 'I will be pinned and unpinned',
});

const collectedProject = makeTestProject({
  id: 'collected-project-id',
  domain: 'collected-project',
  description: 'I will be added and removed from a collection',
});

const deletedProject = makeTestProject({
  id: 'deleted-project-id',
  domain: 'deleted-project',
  description: 'I am a project that will be deleted',
});

const user = makeTestUser({
  persistentToken: Cypress.env('GLITCH_TOKEN'),
  id: 1,
  login: 'test-user',
  name: 'test user',
  description: 'a test user',
});

const anotherUser = makeTestUser({
  id: 2,
  login: 'another-user',
  name: 'another user',
  description: 'another test user',
  featuredProjectId: featuredProject.id,
});

const groupProject = makeTestProject({
  id: 'group-project-id',
  domain: 'group-project',
  description: 'I am a group project that will be left :(',
  permissions: [
    {
      userId: anotherUser.id,
      accessLevel: 30,
    },
  ],
});

const collection = makeTestCollection();

let pinnedProjects = [];
let projects = [
  featuredProject,
  pinnedProject,
  collectedProject,
  groupProject,
  deletedProject,
  ...times(6, (index) =>
    makeTestProject({
      id: `test-project-${index}-id`,
      domain: `test-project-${index}`,
    }),
  ),
].map((project) => ({
  ...project,
  permissions: [
    ...project.permissions,
    {
      userId: user.id,
      accessLevel: project.id === 'group-project-id' ? 20 : 30,
    },
  ],
  permission: {
    userId: user.id,
    projectId: project.id,
    accessLevel: 30,
    userLastAccess: '2019-05-17T20:21:03.134Z',
  },
  users: [user],
}));
let teams = [];
let collections = [collection];
let deletedProjects = [deletedProject];

const shouldHaveProjectOptions = (options) => options.forEach((option) => cy.contains('.project-options-pop', option).should('exist'));

xdescribe('User profile', () => {
  context('when signed in on your own profile', () => {
    /**
     * Perform feature, pin, add to collection, take a Percy snapshot
     * Perform un-feature, un-pin, delete, leave group project, and
     * leave team project, then take a Percy snapshot
     */
    it('can perform project actions', () => {
      // Set up our sever and mock responses
      cy.server();

      // TeamOrUser tries to load a team before a user to determine what page to render
      cy.route('GET', `**/v1/teams/by/url?url=${user.login}`, {});
      cy.route('GET', `**/v1/users/by/login?login=*`, keyByValueResponse([user], 'login'));

      cy.route('GET', `**/v1/users/by/persistentToken?persistentToken=${user.persistentToken}`, keyByValueResponse([user], 'persistentToken'));
      cy.route('GET', `**/users/by/id?id=${user.id}`, keyByValueResponse([user], 'id'));

      cy.route('GET', `**/v1/users/by/login/pinnedProjects?login=${user.login}*`, itemsResponse(pinnedProjects));
      cy.route('GET', `**/v1/users/by/login/projects?login=${user.login}*`, itemsResponse(projects));
      cy.route('GET', `**/v1/users/by/login/teams?login=${user.login}*`, itemsResponse(teams));
      cy.route('GET', `**/v1/users/by/login/collections?login=${user.login}*`, itemsResponse(collections));

      cy.route('GET', `**/v1/users/by/id/projects?id=${user.id}*`, itemsResponse(projects));
      cy.route('GET', `**/v1/users/by/id/teams?id=${user.id}*`, itemsResponse(teams));
      cy.route('GET', `**/v1/users/by/id/collections?id=${user.id}*`, itemsResponse(collections));

      cy.route('GET', '**/collections?userId=*', collections);
      cy.route('GET', '**/collections?id=*', itemsResponse(collections));

      cy.route('GET', '**/projects/byIds?ids=*', projects);

      cy.route('GET', '**/v1/projects/by/id*', keyByValueResponse(projects, 'id')).as('projects');
      cy.route('GET', '**/v1/projects/by/id/collections?id*', itemsResponse());

      cy.route('GET', `**/v1/users/${user.id}/deletedProjects*`, itemsResponse(deletedProjects));

      cy.signIn();

      cy.route('PATCH', '**/users/*', { featuredProjectId: featuredProject.id }).as('featureProject');

      cy.visit(`/@${user.login}`).wait('@projects');

      cy.contains('[data-cy=recent-projects] ul li', featuredProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);

        cy.contains('Feature')
          .click()
          .wait('@featureProject');
      });

      cy.route('POST', '**/users/*/pinned-projects/*', { projectId: pinnedProject.id });

      cy.contains('[data-cy=recent-projects] ul li', pinnedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);
        cy.contains('Pin').click();
      });

      cy.route('PATCH', `**/collections/${collection.id}/add/${collectedProject.id}`, 'OK');

      cy.contains('[data-cy=recent-projects] ul li', collectedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);
        cy.contains('Add to Collection').click();

        cy.route('GET', '**/collections?userId=*', [
          {
            ...collection,
            projects: [collectedProject],
          },
        ]);

        cy.get('.add-project-to-collection-pop')
          .should('exist')
          .within(() => {
            // Need to wait on something to get the shorter syntax to work?
            cy.get('.results')
              .find('li')
              .first()
              .click();
          });
      });

      cy.percySnapshot('after featuring, pinning, and collecting projects');

      cy.route('PATCH', '**/users/*', { featuredProjectId: null });

      cy.get('[data-cy=featured-project] .project-options')
        .click()
        .parent()
        .within(() => {
          shouldHaveProjectOptions(['Un-feature']);
          cy.contains('Un-feature').click();
        });

      cy.route('DELETE', '**/users/*/pinned-projects/*', 'OK');

      cy.contains('[data-cy=pinned-projects] ul li', pinnedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Un-Pin', 'Add to Collection', 'Delete']);
        cy.contains('Un-Pin').click();
      });

      cy.route('DELETE', `**/projects/${groupProject.id}/authorization`, 'OK');
      cy.contains('[data-cy=recent-projects] ul li', groupProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Leave']);
        cy.contains('Leave').click();
      });

      cy.route('DELETE', `**/projects/${deletedProject.id}`, 'OK');
      cy.route('GET', `**/projects/${deletedProject.id}?showDeleted=true`, 'OK');

      cy.contains('[data-cy=recent-projects] ul li', deletedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);
        cy.contains('Delete').click();
      });

      cy.contains('[data-cy=deleted-projects] button', 'Show').click();

      cy.percySnapshot('after leaving and deleting projects');
    });
  });
});
