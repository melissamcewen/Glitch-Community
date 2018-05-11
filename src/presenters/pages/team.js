import Observable from 'o_0';
import {debounce} from 'lodash';
import mdFactory from 'markdown-it';
import assets from '../../utils/assets';

const md = mdFactory({
  breaks: true,
  linkify: true,
  typographer: true,
});

import Project from '../../models/project';
import User from '../../models/user';
import TeamTemplate from '../../templates/pages/team';
import LayoutPresenter from '../layout';
import AnalyticsPresenter from '../analytics';

import Reactlet from "../reactlet";
import AddTeamUser from '../includes/add-team-user.jsx';
import EntityPageProjects from "../entity-page-projects.jsx";
import AddTeamProjectPop from "../pop-overs/add-team-project-pop.jsx";

import TeamProfile from "../includes/team-profile.jsx";
import TeamUsers from "../includes/team-users.jsx";

export default function(application) {
  const assetUtils = assets(application);

  var self = {

    application,
    team: application.team,
    hiddenIfTeamFetched() { return application.team().hiddenIfFetched(); },
    hiddenUnlessTeamFetched() { return application.team().hiddenUnlessFetched(); },
    initialTeamDescription: Observable(undefined),

    verifiedTeamTooltip() {
      return application.team().verifiedTooltip();
    },
    
    TeamProfile() {
      return Reactlet(TeamProfile, {});
    },
    
    TeamUsers() {
      const props = {
        users: application.team().users().map(user => user.asProps()),
        currentUserIsOnTeam: application.team().currentUserIsOnTeam(application),
        removeUserFromTeam: ({id}) => application.team().removeUser(application, User({id}))
      };
      return Reactlet(TeamUsers, props, "TeamPageUserList");
    },

    TeamProjects() {
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        isAuthorizedUser: application.team().currentUserIsOnTeam(application),
        projectsObservable: application.team().projects,
        pinsObservable: application.team().pins,
        projectOptions: self.projectOptions(),
      };

      return Reactlet(EntityPageProjects, props, "UserPageProjectsContainer");
    },

    projectOptions(){
      const userHasProjectOptions = application.team().currentUserIsOnTeam(application);
      if(!userHasProjectOptions) {
        return {};
      }

      return {
        removeProjectFromTeam: self.removeProjectFromTeam,
        togglePinnedState: self.togglePinnedState,
      };
    },

    teamAnalytics() {
      if (self.team().fetched()) {
        return AnalyticsPresenter(application, self.team());
      }
    },

    addTeamUserButton() {
      //self.currentUserIsOnTeam && self.currentUserIsOnTeam.observe(item => console.log("current user on team update!", item));
      const props = {
        search: (query) => User.getSearchResultsJSON(application, query).then(users => users.map(user => User(user).asProps())),
        add: (id) => application.team().addUser(application, User({id})),
        members: application.team().users().map(user => user.id()),
      };
      return Reactlet(AddTeamUser, props, "TeamPageAddUserButton");
    },

    addTeamProjectPop() {
      const action = (projectData) => {
        const project = Project(projectData);
        application.team().addProject(application, project);
      };

      const props = {
        api: application.api,
        teamUsers: application.team().users(),
        action,
      };

      return Reactlet(AddTeamProjectPop, props);
    },

    coverUrl() {
      if (application.team().localCoverImage()) {
        return application.team().localCoverImage();
      }
      return application.team().coverUrl();

    },

    teamProfileStyle() {
      return {
        backgroundColor: application.team().coverColor(),
        backgroundImage: `url('${self.coverUrl()}')`,
      };
    },

    teamAvatarStyle() {
      if (application.team().hasAvatarImage()) {
        return {backgroundImage: `url('${self.teamAvatarUrl()}')`};
      }
      return {backgroundColor: application.team().backgroundColor()};

    },

    teamName() {
      return application.team().name();
    },

    teamThanks() {
      return application.team().teamThanks();
    },

    isVerified() {
      return application.team().isVerified();
    },

    verifiedImage() {
      return application.team().verifiedImage();
    },

    hiddenUnlessVerified() {
      if (!self.isVerified()) { return 'hidden'; }
    },

    hiddenUnlessTeamHasThanks() {
      if (!(application.team().thanksCount() > 0)) { return 'hidden'; }
    },

    currentUserIsOnTeam() {
      return application.team().currentUserIsOnTeam(application);
    },

    hiddenUnlessCurrentUserIsOnTeam() {
      if (!self.currentUserIsOnTeam(application)) { return 'hidden'; }
    },

    hiddenIfCurrentUserIsOnTeam() {
      if (self.currentUserIsOnTeam(application)) { return 'hidden'; }
    },

    description() {
      const text = application.team().description();
      const node = document.createElement('span');
      node.innerHTML = md.render(text);
      return node;
    },

    setInitialTeamDescription() {
      const description = application.team().description();
      const node = document.createElement('span');
      node.innerHTML = md.render(description);
      if (description) {
        return self.initialTeamDescription(node);
      }
    },

    updateDescription(event) {
      const text = event.target.textContent;
      application.team().description(text);
      return self.updateTeam({
        description: text});
    },

    updateTeam: debounce(data => application.team().updateTeam(application, data)
      , 250),

    applyDescription(event) {
      return event.target.innerHTML = md.render(application.team().description());
    },
    // application.notifyUserDescriptionUpdated true

    teamAvatarUrl() {
      if (application.team().localAvatarImage()) {
        return application.team().localAvatarImage();
      }
      return application.team().teamAvatarUrl('large');

    },


    hiddenIfNoDescription() {
      if (application.team().description().length === 0) { return 'hidden'; }
    },

    uploadCover() {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        console.log('☔️☔️☔️ input onchange', file);
        return assetUtils.addCoverFile(file);
      };
      input.click();
      console.log('input created: ', input);
      return false;
    },

    uploadAvatar() {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        console.log('☔️☔️☔️ input onchange', file);
        return assetUtils.addAvatarFile(file);
      };
      input.click();
      console.log('input created: ', input);
      return false;
    },

    togglePinnedState(projectId) {
      const action = Project.isPinnedByTeam(application.team(), projectId) ? "removePin" : "addPin";
      return application.team()[action](application, projectId);
    },

    removeProjectFromTeam(projectId) {
      application.team().removeProject(application, projectId);
    },

    hiddenIfOnTeam() {
      if (self.currentUserIsOnTeam()) { return 'hidden'; }
    },

    hiddenUnlessAddTeamProjectPopVisible() {
      if (!application.addTeamProjectPopVisible()) { return 'hidden'; }
    },

    toggleAddTeamProjectPop() {
      application.addTeamProjectPopVisible.toggle();
      if (application.addTeamProjectPopVisible()) {
        return $('#team-project-search').focus();
      }
    },
  };

  application.team.observe(function(newVal) {
    if (newVal) {
      return self.setInitialTeamDescription();
    }
  });

  const content = TeamTemplate(self);

  return LayoutPresenter(application, content);
}
