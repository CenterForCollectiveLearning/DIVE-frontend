import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from '../../css/app.css';

import BaseComponent from './BaseComponent';

import DatasetList from './DatasetList';

class Datasets extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { datasets } = this.props;
    return (
      <main>
        <toolbar className={styles.toolbar} >
          <DatasetList datasets={datasets.items} />
        </toolbar>
      </main>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets } = state;
  return {
    project,
    datasets
  };
}


export default connect(mapStateToProps)(Datasets)
