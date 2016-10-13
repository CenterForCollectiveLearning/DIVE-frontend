import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import AggregationSidebar from './AggregationSidebar';
import AggregationView from './AggregationView';

export class AggregationBasePage extends Component {
  componentWillMount() {
    // this.props.restoreStateFromLocation(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    console.log('AggregationBasePage will receive props', this.props, nextProps);
    // console.log(this.context.router)
    // if (location.query !== this.props.location.query) {
    //   setExploreQueryString(location.query);
    // }
  }

  render() {
    const { projectTitle } = this.props;

    // Get parameters encoded in query params
    // { trackedParam: null }
    const trackedParams = [ 'fieldIds' ]
    const queryParams = trackedParams.reduce((obj, trackedParam, index) => {
      obj[trackedParam] = this.props.location.query[trackedParam];
      return obj;
    }, {});

    console.log(queryParams);

    return (
      <DocumentTitle title={ 'Aggregation' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <AggregationView queryParams={ queryParams }/>
          <AggregationSidebar queryParams={ queryParams }/>
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project } = state;

  return { projectTitle: project.title };
}

export default connect(mapStateToProps, { })(AggregationBasePage);
