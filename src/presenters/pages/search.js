import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { withRouter } from 'react-router-dom';

import SearchResults from 'Components/search-results';
import NotFound from 'Components/errors/not-found';
import MoreIdeas from 'Components/more-ideas';
import Layout from 'Components/layout';
import { useAlgoliaSearch } from 'State/search';
import { AnalyticsContext } from 'State/segment-analytics';

const SearchPage = withRouter(({ query, activeFilter, history }) => {
  const searchResults = useAlgoliaSearch(query);
  const setActiveFilter = (filter) => {
    history.push(`/search?q=${encodeURIComponent(query)}&activeFilter=${filter}`);
  };

  return (
    <AnalyticsContext properties={{ origin: 'search', query }}>
      <Layout searchQuery={query}>
        {!!query && <Helmet title={`Search for ${query}`} />}
        {query ? (
          <SearchResults query={query} searchResults={searchResults} activeFilter={activeFilter || 'all'} setActiveFilter={setActiveFilter} />
        ) : (
          <NotFound name="anything" />
        )}
        <MoreIdeas />
      </Layout>
    </AnalyticsContext>
  );
});

SearchPage.propTypes = {
  query: PropTypes.string,
  activeFilter: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
  activeFilter: 'all',
};

export default SearchPage;
