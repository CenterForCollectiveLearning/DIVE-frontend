import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { closeColumnReductionModal } from '../../actions/DatasetActions';

import styles from './ReduceColumnsModal.sass';

import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';
import SelectGrid from '../Base/SelectGrid';
import Input from '../Base/Input';

class ReduceColumnsModal extends Component {

  render() {
    return (
      <BlockingModal
        closeAction={ this.props.closeColumnReductionModal }
        heading={
          <span>Select Columns to Display</span>
        }
        footer={
          <div className={ styles.rightActions }>
            <RaisedButton primary onClick={ this.props.closeColumnReductionModal }>Choose columns</RaisedButton>
          </div>
        }>
        <div>
          <SelectGrid items={ this.props.columns }/>
        </div>
      </BlockingModal>
    );
  }
}

ReduceColumnsModal.propTypes = {
  columns: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { closeColumnReductionModal })(ReduceColumnsModal);
