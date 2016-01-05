import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { setGalleryQueryString } from '../../../actions/VisualizationActions';

import styles from '../Visualizations.sass';
import GallerySidebar from './GallerySidebar';
import GalleryView from './GalleryView';

class GalleryPage extends Component {
  componentWillMount() {
    this.props.setGalleryQueryString(this.props.location.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query !== this.props.location.query) {
      this.props.setGalleryQueryString(nextProps.location.query);
    }
  }

  render() {
    return (
      <div className={ `${styles.fillContainer} ${styles.galleryContainer}` }>
        <GallerySidebar queryFields={ this.props.location.query.fields || [] }/>
        <GalleryView />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { setGalleryQueryString })(GalleryPage);
