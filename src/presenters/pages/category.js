import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import CollectionContainer from 'Components/collection/container';
import MoreIdeas from 'Components/more-ideas';
import DataLoader from 'Components/data-loader';
import Layout from 'Components/layout';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCollectionEditor } from 'State/collection';

const CategoryPageWrap = ({ category: initialCategory }) => {
  const [category, { addProjectToCollection }] = useCollectionEditor(initialCategory);
  return (
    <React.Fragment>
      <Helmet title={category.name} />
      <main className="collection-page">
        <CollectionContainer collection={category} funcs={{ addProjectToCollection }} />
      </main>
      <MoreIdeas />
    </React.Fragment>
  );
};

async function loadCategory(api, id) {
  const { data: category } = await api.get(`categories/${id}`);
  return {
    ...category,
    coverColor: category.backgroundColor,
    glitchTeam: true,
    projects: category.projects.map((project) => ({
      ...project,
      permissions: [],
      teamIds: [],
    })),
  };
}

const CategoryPage = ({ category }) => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'category' }}>
      <DataLoader get={(api) => loadCategory(api, category.id)}>{(loadedCategory) => <CategoryPageWrap category={loadedCategory} />}</DataLoader>
    </AnalyticsContext>
  </Layout>
);
CategoryPage.propTypes = {
  category: PropTypes.object.isRequired,
};

export default CategoryPage;
