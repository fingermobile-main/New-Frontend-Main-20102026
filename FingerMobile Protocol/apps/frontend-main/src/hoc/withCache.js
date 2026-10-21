import React from 'react';
import dataCache from '../utils/dataCache';

/**
 * Higher-Order Component for adding caching capabilities to components
 * @param {React.Component} WrappedComponent - Component to wrap with caching
 * @param {Object} options - Configuration options
 * @returns {React.Component} - Component with caching capabilities
 */
export const withCache = (WrappedComponent, options = {}) => {
  const {
    cacheKey,
    ttl = 5 * 60 * 1000, // 5 minutes default
    fetchData, // Function to fetch data if not in cache
  } = options;

  return class WithCache extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: null,
        loading: false,
        error: null
      };
    }

    componentDidMount() {
      this.loadData();
    }

    loadData = async () => {
      if (!cacheKey || !fetchData) return;

      this.setState({
        loading: true,
        error: null
      });

      try {
        // Check cache first
        let data = dataCache.get(cacheKey);

        if (!data) {
          // Fetch fresh data
          data = await fetchData();
          // Store in cache
          dataCache.set(cacheKey, data, ttl);
        }

        this.setState({
          data,
          loading: false
        });
      } catch (error) {
        console.error(`Error loading data for ${cacheKey}:`, error);
        this.setState({
          error,
          loading: false
        });
      }
    };

    refreshData = async () => {
      if (!cacheKey || !fetchData) return;

      // Clear cache entry
      dataCache.delete(cacheKey);

      // Reload data
      await this.loadData();
    };

    clearCache = () => {
      if (cacheKey) {
        dataCache.delete(cacheKey);
      }
    };

    render() {
      const { data, loading, error } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          cacheData={data}
          cacheLoading={loading}
          cacheError={error}
          refreshCache={this.refreshData}
          clearCache={this.clearCache}
        />
      );
    }
  };
};

export default withCache;
