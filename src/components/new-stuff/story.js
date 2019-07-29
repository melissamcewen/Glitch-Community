import React from 'react';
import { storiesOf } from '@storybook/react';

import NewStuffArticle from './new-stuff-article';
import NewStuffPrompt from './new-stuff-prompt';
import NewStuffPup from './new-stuff-pup';

const story = storiesOf('New Stuff', module);

story.add('Article', () => (
  <div style={{ maxWidth: '450px' }}>
    <NewStuffArticle title="Article Title"
      body="Lorem ipsum is a _placeholder text_ commonly used to demonstrate the visual form of a document without relying on meaningful content (also called _greeking_)."
    />
  </div>
));

story.add('Article with link', () => (
  <div style={{ maxWidth: '450px' }}>
    <NewStuffArticle title="Article Title" body={'check out that link\n# 👇 👇 👇'} link="#" />
  </div>
));

story.add('Many Articles', () => (
  <div style={{ maxWidth: '450px' }}>
    <NewStuffArticle title="Article Title 1" body={'markdown _body_ __here__'} link="#" />
    <NewStuffArticle title="Article Title 2" body={'markdown _body_ here\n\nall over again'} />
    <NewStuffArticle title="Article Title 3" body={'- hello\n- i am a list\n- an unordered list'} />
  </div>
));

story.add('Update Pup', () => (
  <React.Fragment>
    <NewStuffPup />
    <NewStuffPrompt onClick={() => alert('woof')} />
  </React.Fragment>
));
