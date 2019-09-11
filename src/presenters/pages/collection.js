import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { kebabCase } from 'lodash';

import { getCollectionLink } from 'Models/collection';
import { PopoverWithButton } from 'Components/popover';
import NotFound from 'Components/errors/not-found';
import DataLoader from 'Components/data-loader';
import CollectionContainer from 'Components/collection/container';
import MoreCollectionsContainer from 'Components/collections-list/more-collections';
import DeleteCollection from 'Components/collection/delete-collection-pop';
import Layout from 'Components/layout';
import ReportButton from 'Components/report-abuse-pop';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCollectionEditor, userOrTeamIsAuthor, getCollectionWithProjects } from 'State/collection';
import useFocusFirst from 'Hooks/use-focus-first';

const CollectionPageContents = ({ collection: initialCollection }) => {
  const { currentUser } = useCurrentUser();
  const [collection, baseFuncs] = useCollectionEditor(initialCollection);
  useFocusFirst();

  const currentUserIsAuthor = userOrTeamIsAuthor({ collection, user: currentUser });

  const funcs = {
    ...baseFuncs,
    onNameChange: async (name) => {
      const url = kebabCase(name);
      const result = await funcs.updateNameAndUrl({ name, url });
      window.history.replaceState(null, null, getCollectionLink({ ...collection, url }));
      return result;
    },
  };
  return (
    <>
      <Helmet title={collection.name} />
      <main id="main">
        <CollectionContainer collection={collection} showFeaturedProject isAuthorized={currentUserIsAuthor} funcs={funcs} />
        {!currentUserIsAuthor && <ReportButton reportedType="collection" reportedModel={collection} />}
        {currentUserIsAuthor && !collection.isMyStuff && (
          <PopoverWithButton buttonProps={{ size: 'small', variant: 'warning', emoji: 'bomb' }} buttonText={`Delete ${collection.name}`}>
            {() => <DeleteCollection collection={collection} />}
          </PopoverWithButton>
        )}
      </main>
      <MoreCollectionsContainer collection={collection} />
    </>
  );
};

CollectionPageContents.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
  }).isRequired,
};

const CollectionPage = ({ owner, name }) => (
  <Layout>
    <DataLoader get={(api, args) => getCollectionWithProjects(api, args)} args={{ owner, name }}>
      {(collection) =>
        collection ? (
          <AnalyticsContext
            properties={{ origin: 'collection', collectionId: collection.id }}
            context={{
              groupId: collection.team ? collection.team.id.toString() : '0',
            }}
          >
            <CollectionPageContents collection={collection} />
          </AnalyticsContext>
        ) : (
          <NotFound name={name} />
        )
      }
    </DataLoader>
  </Layout>
);

export default CollectionPage;
