import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './visualizations.sass';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import GalleryView from './GalleryView';

class GalleryPage extends Component {
  render() {
    return (
      <div className={ `${styles.fillContainer} ${styles.galleryContainer}` }>
        <Sidebar />
        <div className={ styles.topbarAndContent }>
          <Topbar />
          <GalleryView />
        </div>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(GalleryPage);
