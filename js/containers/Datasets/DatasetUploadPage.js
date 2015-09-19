import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import baseStyles from '../../../css/flexbox.sass';

import BaseComponent from '../../components/BaseComponent';

export class DatasetUploadPage extends BaseComponent {
  render() {
    return (
      <div className={baseStyles.fillContainer + ' ' + baseStyles.centeredFill}>
        Dataset Upload
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { })(DatasetUploadPage);
