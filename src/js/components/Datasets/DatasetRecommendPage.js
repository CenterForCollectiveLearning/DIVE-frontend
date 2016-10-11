import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { push } from 'react-router-redux';
import { setExploreQueryString } from '../../actions/VisualizationActions';
import { fetchDataset, fetchDatasets, deleteDataset } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';

import styles from './DatasetRecommendation.sass';

import HeaderBar from '../Base/HeaderBar';
import RaisedButton from '../Base/RaisedButton';
import DropDownMenu from '../Base/DropDownMenu';
import RecommendSidebar from './RecommendSidebar';
import RecommendView from './RecommendView';

export class DatasetRecommendPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.setExploreQueryString(this.props.location.query);
  }

  componentWillReceiveProps(nextProps) {
    const { location, specs, filters, setExploreQueryString } = nextProps;

    if (location.query !== this.props.location.query) {
      setExploreQueryString(location.query);
    }
  }

  render() {
    const { projectTitle } = this.props;

    var queryFields = [];
    if (this.props.location.query['fields[]']) {
      if (Array.isArray(this.props.location.query['fields[]'])) {
        queryFields = this.props.location.query['fields[]'];
      } else {
        queryFields = [this.props.location.query['fields[]']];
      }
    }

    return (
      <DocumentTitle title={ 'Recommend' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ styles.recommendationPage }>
          <RecommendView />
          <RecommendSidebar />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
    }
}

function mapStateToProps(state) {
  const { project, filters, specs } = state;
  return { project, projectTitle: project.title, filters, specs };
}

export default connect(mapStateToProps, {
  setExploreQueryString,
})(DatasetRecommendPage);
