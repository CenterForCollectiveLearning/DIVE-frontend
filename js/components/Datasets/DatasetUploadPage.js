import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uploadDataset } from '../../actions/DatasetActions';
import styles from './datasets.sass';

import RaisedButton from '../Base/RaisedButton';
import Dropzone from 'react-dropzone';

export class DatasetUploadPage extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
  }

  onDrop(files) {
    this.props.uploadDataset(this.props.project.properties.id, files[0]);
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }

  render() {
    return (
      <div className={ styles.fillContainer }>
        <Dropzone ref="dropzone" className={ styles.dropzone + ' ' + styles.centeredFill } onDrop={ this.onDrop } disableClick={ true }>
          <RaisedButton label="Select & upload a file" primary={ true } onClick={ this.onOpenClick } />
          <span>or drop files here to upload</span>
        </Dropzone>
        {this.props.children}
      </div>
    );
  }
}

DatasetUploadPage.propTypes = {
  project: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {
  const { project } = state;
  return { project };
}

export default connect(mapStateToProps, { uploadDataset })(DatasetUploadPage);
