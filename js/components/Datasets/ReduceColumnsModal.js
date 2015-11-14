import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';
import Input from '../Base/Input';

class ReduceColumnsModal extends Component {

  render() {
    return (
      <BlockingModal heading={
        <span>Select Columns to Display</span>
      }>
        <div>
          `content`
        </div>
      </BlockingModal>
    );
  }
}

ReduceColumnsModal.propTypes = {
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(ReduceColumnsModal);
