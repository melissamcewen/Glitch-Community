import React from 'react';
import { mapValues, sumBy, memoize } from 'lodash';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import Markdown from 'Components/text/markdown';
import Badge from 'Components/badges/badge';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import ProjectItem from 'Components/project/project-item';
import ProjectItemSmall from 'Components/project/project-item-small';
import CollectionItem from 'Components/collection/collection-item';
import CollectionItemSmall from 'Components/collection/collection-item-small';
import TeamItem from 'Components/team/team-item';
import TeamUsers from 'Components/team-users';
import UserItem from 'Components/user/user-item';
import SearchResultCoverBar from 'Components/search-result-cover-bar';
import Thanks from 'Components/thanks';
import Loader from 'Components/loader';
import NotFound from 'Components/errors/not-found';
import SearchResults from 'Components/search-results';
import StarterKitResult from 'Components/search/starter-kit-result';
import Embed from 'Components/project/embed';
import ProjectEmbed from 'Components/project/project-embed';
import FeaturedProject from 'Components/project/featured-project';
import CoverContainer from 'Components/containers/cover-container';
import Note from 'Components/collection/note';
import MoreIdeas from 'Components/more-ideas';
import Footer from 'Components/footer';
import RecentProjects from 'Components/recent-projects';
import Notification from 'Components/notification';
import Progress from 'Components/fields/progress';
import Video from 'Components/video';
import 'Components/profile-list/story';
import 'Components/search-form/story';
import 'Components/header/story';
import 'Components/containers/profile/story';
import 'Components/collections-list/story';
import 'Components/questions/story';
import 'Components/deleted-projects/story';
import { users, teams, projects, collections } from './data';
import { withState, provideContext } from './util';


storiesOf('Emoji', module)
  .add('standard', () => <Emoji name="herb" />)
  .add('sunglasses', () => <Emoji name="sunglasses" />);

storiesOf('TooltipContainer', module)
  .add('action', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" target={<Button>Hover or focus me</Button>} tooltip="I'm an action tooltip" />
    </div>
  ))
  .add('info', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm an info tooltip"
      />
    </div>
  ))
  .add('persistent', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm a persistent tooltip"
        persistent
      />
    </div>
  ))
  .add('left and top aligned', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" target={<Button>Hover or focus me</Button>} tooltip="I'm a tooltip" align={['top', 'left']} />
    </div>
  ));

storiesOf('Image', module)
  .add('regular', () => <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />)
  .add('background Image', () => (
    <Image backgroundImage={true} src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />
  ))
  .add('srcSet', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg"
      srcSet={[
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg?x=2 1000w',
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg?x=1 2000w',
      ]}
      alt="Glitch Logo"
    />
  ))
  .add('width & height', () => (
    <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" width="200" height="200" />
  ))
  .add('width & height with background image', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg"
      backgroundImage
      alt="Glitch Logo"
      width="200px"
      height="200px"
    />
  ));
storiesOf('Video', module)
  .add('default', () => (
    <Video
      sources={[
        { src: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flive-small2.mp4', minWidth: 0, maxWidth: 669 },
        { src: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flive.mp4', minWidth: 700 },
      ]}
      track='some-caption-track.vtt'
      controls
    />
  ))
  .add('muted', () => (
    <Video
      sources={[
        { src: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flive-small2.mp4', minWidth: 0, maxWidth: 669 },
        { src: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flive.mp4', minWidth: 700 },
      ]}
      track='muted'
      autoPlay
      loop
    />
  ));

storiesOf('Heading', module)
  .add('h1 ', () => <Heading tagName="h1">H1, 22px</Heading>)
  .add('h2', () => <Heading tagName="h2">H2, 18px</Heading>)
  .add('h3', () => <Heading tagName="h3">H3, 16px</Heading>)
  .add('h4', () => <Heading tagName="h4">H4, 14px</Heading>);

storiesOf('Text', module).add('regular ', () => <Text>Regular, 20px</Text>);

storiesOf('Markdown', module)
  .add('regular', () => <Markdown>Some __Markdown__</Markdown>)
  .add('truncated', () => <Markdown length={35}>35 characters of rendered __Markdown__ (and a little **more**)</Markdown>);

storiesOf('Badge', module)
  .add('regular', () => <Badge>Regular</Badge>)
  .add('success', () => <Badge type="success">Success</Badge>)
  .add('warning', () => <Badge type="warning">Warning</Badge>)
  .add('error', () => <Badge type="error">Error</Badge>)
  .add('private', () => <Badge type="private" />);

storiesOf('Segmented-Buttons', module)
  .add(
    'regular',
    withState('a', ({ state, setState }) => (
      <SegmentedButtons
        value={state}
        onChange={setState}
        buttons={[{ name: 'a', contents: 1 }, { name: 'b', contents: 2 }, { name: 'c', contents: 3 }]}
      />
    )),
  )
  .add(
    'jsx contents',
    withState('a', ({ state, setState }) => (
      <SegmentedButtons
        value={state}
        onChange={setState}
        buttons={[
          {
            name: 'a',
            contents: (
              <React.Fragment>
                <Badge>Normal</Badge> Badge
              </React.Fragment>
            ),
          },
          {
            name: 'b',
            contents: (
              <React.Fragment>
                <Badge type="error">Error</Badge> Badge
              </React.Fragment>
            ),
          },
        ]}
      />
    )),
  );

storiesOf('ProjectItem', module)
  .add(
    'base',
    provideContext({ currentUser: {} }, () => (
      <div style={{ margin: '2em', width: '25%' }}>
        <ProjectItem project={projects['judicious-pruner']} />
      </div>
    )),
  )
  .add('Project Item Small', () => (
    <div style={{ backgroundColor: '#F5F5F5', width: '375px', padding: '10px' }}>
      <ProjectItemSmall
        project={{
          id: 'foo',
          domain: 'judicious-pruner',
          private: false,
        }}
      />
    </div>
  ))
  .add('Project Item Small - private', () => (
    <div style={{ backgroundColor: '#F5F5F5', width: '375px', padding: '10px' }}>
      <ProjectItemSmall
        project={{
          id: 'foo',
          domain: 'judicious-pruner',
          private: true,
        }}
      />
    </div>
  ));

const mockAPI = {
  async get(url) {
    return { data: this.responses[url] };
  },
  responses: {
    '/v1/users/by/id/?id=271885': { 271885: users.modernserf },
  },
};

storiesOf('Collection', module)
  .add('Collection Item with projects', provideContext({ currentUser: {}, api: mockAPI }, () => <CollectionItem collection={collections[12345]} />))
  .add(
    'Collection Item without projects',
    provideContext({ currentUser: {}, api: mockAPI }, () => <CollectionItem collection={collections['empty']} />),
  )
  .add(
    'Collection Item with curator',
    provideContext({ currentUser: {}, api: mockAPI }, () => <CollectionItem collection={collections[12345]} showCurator />),
  )
  .add(
    'Collection Item Small',
    provideContext({ currentUser: {}, api: mockAPI }, () => (
      <div style={{ margin: '2em', width: '25%' }}>
        <CollectionItemSmall collection={collections[12345]} />
      </div>
    )),
  );

storiesOf('UserItem', module).add('base', () => (
  <div style={{ margin: '2em', width: '25%' }}>
    <UserItem user={users.modernserf} />
  </div>
));

storiesOf('TeamItem', module).add('base', () => (
  <div style={{ margin: '2em', width: '25%' }}>
    <TeamItem team={teams['example-team']} />
  </div>
));
       
storiesOf('TeamUsers', module)
  // only partially implemented due to notifications not working in storybook
  .add('base', provideContext({ currentUser: {}, api: mockAPI }, () => <TeamUsers team={teams['example-team']} />));

storiesOf('SearchResultCoverBar', module)
  .add('user', () => (
    <div style={{ margin: '2em', width: '25%' }}>
      <SearchResultCoverBar type="user" item={users.modernserf} size="medium" />
    </div>
  ))
  .add('user without cover', () => (
    <div style={{ margin: '2em', width: '25%' }}>
      <SearchResultCoverBar type="user" item={{ id: 123, login: 'nobody' }} size="medium" />
    </div>
  ));

storiesOf('Thanks', module).add('variations', () => (
  <div>
    <Thanks count={1} />
    <Thanks count={2} />
    <Thanks count={3} />
    <Thanks count={3} short />
  </div>
));

storiesOf('Loader', module).add('loader', () => <Loader />);

storiesOf('NotFound', module).add('not found', () => <NotFound name="any results" />);

storiesOf('SearchResults', module).add(
  'results',
  provideContext(
    { currentUser: {}, api: mockAPI },
    withState('all', ({ state, setState }) => (
      <SearchResults
        query="modernserf"
        activeFilter={state}
        setActiveFilter={setState}
        searchResults={{
          status: 'ready',
          totalHits: 2,
          topResults: [{ ...users.modernserf, type: 'user', isExactMatch: true }],
          team: [],
          user: [{ ...users.modernserf, type: 'user', isExactMatch: true }],
          project: [{ ...projects['modernserf-zebu'], type: 'project' }],
          collection: [],
          starterKit: [],
        }}
      />
    )),
  ),
);

storiesOf('StarterKit', module).add('react', () => (
  <StarterKitResult
    result={{
      id: 1,
      type: 'starter-kit',
      keywords: ['react'],
      imageURL: 'https://glitch.com/culture/content/images/2018/10/react-starter-kit-1.jpg',
      name: 'Build a Web App with React',
      url: 'https://glitch.com/culture/react-starter-kit/',
      description: 'A free, 5-part video course with interactive code examples that will help you learn React.',
      coverColor: '#f0fcff',
    }}
  />
));

storiesOf('Embed', module).add('regular', () => <Embed domain="community-staging" />);

const TopLeft = <h2>This project is bananas</h2>;
const TopRight = <button>I am on top</button>;
const BottomRight = (
  <React.Fragment>
    <button>one</button>
    <button>two</button>
  </React.Fragment>
);
const BottomLeft = <button>Everything you own in a box to the left</button>;
const addProjectToCollection = () => {};

storiesOf('ProjectEmbed', module)
  .add(
    'does not own project, not logged in',
    provideContext({ currentUser: {} }, () => (
      <ProjectEmbed
        project={{ id: '123', domain: 'community-staging' }}
        addProjectToCollection={addProjectToCollection}
      />
    )),
  )
  .add(
    'does not own project, is logged in',
    provideContext({ currentUser: { login: '@sarahzinger' } }, () => (
      <ProjectEmbed
        project={{ id: '123', domain: 'community-staging' }}
        addProjectToCollection={addProjectToCollection}
      />
    )),
  )
  .add('owns project, is logged in', () => (
    <ProjectEmbed
      project={{ id: '123', domain: 'community-staging' }}
      addProjectToCollection={addProjectToCollection}
    />
  ));

const unfeatureProject = () => {};

storiesOf('FeaturedProject', module)
  .add(
    'owns featured project',
    provideContext({ currentUser: {} }, () => (
      <FeaturedProject
        featuredProject={{ id: '123', domain: 'community-staging' }}
        isAuthorized={true}
        addProjectToCollection={addProjectToCollection}
        unfeatureProject={unfeatureProject}
      />
    )),
  )
  .add(
    'does not own featured project',
    provideContext({ currentUser: { login: '@sarahzinger' } }, () => (
      <FeaturedProject featuredProject={{ id: '123', domain: 'community-staging' }} isAuthorized={false} currentUser={{ login: '@sarahzinger' }} />
    )),
  );

const team = {
  backgroundColor: 'rgb(116,236,252)',
  coverColor: 'rgb(12,84,124)',
  hasCoverImage: true,
  name: 'Glitch',
  id: 74,
};

const buttons = (
  <React.Fragment>
    <button>one</button>
    <button>two</button>
  </React.Fragment>
);
storiesOf('CoverContainer', module)
  .add('when passed a user', () => (
    <CoverContainer item={users.modernserf} type="user">
      <div style={{ backgroundColor: 'white' }}>We are the children</div>
    </CoverContainer>
  ))
  .add('when passed a team', () => (
    <CoverContainer item={team} type="team">
      <div style={{ backgroundColor: 'white' }}>We are the children</div>
    </CoverContainer>
  ))
  .add('when passed buttons', () => (
    <CoverContainer item={team} type="team" buttons={buttons}>
      <div style={{ backgroundColor: 'white' }}>
        <p>We are the children</p>
        <p>Notice the buttons are up and to the right</p>
      </div>
    </CoverContainer>
  ));

storiesOf('MoreIdeas', module).add('more ideas', () => <MoreIdeas />);

const mockUpdateNote = (setState) => async ({ note }) => {
  setState({ note, isAddingANewNote: true });
  await new Promise((resolve) => setTimeout(resolve, 300));
};

storiesOf('Note', module)
  .add(
    'when authorized',
    withState(
      {
        note:
          'You are authorized to edit this note, go on ahead and try, if you erase its contents and click away, this note will disappear after a short time',
        isAddingANewNote: true,
      },
      ({ state: project, setState }) => (
        <Note
          isAuthorized={true}
          collection={collections['12345']}
          project={project}
          updateNote={mockUpdateNote(setState)}
          hideNote={() => setState({ isAddingANewNote: false })}
        />
      ),
    ),
  )
  .add(
    'when unauthorized',
    withState(
      {
        note: 'this note you do not own, you can not edit it, you can not hide it',
        isAddingANewNote: true,
      },
      ({ state: project, setState }) => (
        <Note
          isAuthorized={false}
          collection={collections['12345']}
          project={project}
          updateNote={mockUpdateNote(setState)}
          hideNote={() => setState({ isAddingANewNote: false })}
        />
      ),
    ),
  )
  .add(
    'dark notes',
    withState(
      {
        note: 'the background is dark, the text is light',
        isAddingANewNote: true,
      },
      ({ state: project, setState }) => (
        <Note
          isAuthorized={true}
          collection={collections.dark}
          project={project}
          updateNote={mockUpdateNote(setState)}
          hideNote={() => setState({ isAddingANewNote: false })}
        />
      ),
    ),
  );

storiesOf('Footer', module).add('footer', () => <Footer />);

storiesOf('Recent Projects', module)
  .add('anonymous user', provideContext({ currentUser: { color: 'pink', projects: Object.values(projects) } }, () => <RecentProjects />))
  .add(
    'logged-in user loading',
    provideContext({ currentUser: { ...users.modernserf, projects: [] }, currentUserFetched: false }, () => <RecentProjects />),
  )
  .add('logged-in user', provideContext({ currentUser: { ...users.modernserf, projects: Object.values(projects) } }, () => <RecentProjects />));

storiesOf('Notification', module)
  .add('info', () => (
    <Notification>
      Uploading image <Progress value={0} />
    </Notification>
  ))
  .add('persistent', () => <Notification persistent>This notification will be here forever</Notification>)
  .add('success', () => <Notification type="success">Success!</Notification>)
  .add('error', () => <Notification type="error">Something went wrong</Notification>);
