import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uploadDataset } from '../../actions/DatasetActions';
import baseStyles from '../../../css/flexbox.sass';
import styles from './Datasets.sass';

import { RaisedButton } from 'material-ui-io';
import Dropzone from 'react-dropzone';

export class DatasetUploadPage extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.props.uploadDataset(this.props.project.properties.id, files[0]);
  }

  render() {
    return (
      <div className={ baseStyles.fillContainer }>
        <Dropzone className={ styles.dropzone + ' ' + baseStyles.centeredFill } onDrop={ this.onDrop }>
          <RaisedButton label="Select & upload a file" primary={ true } onClick={ this.onDrop } />
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
