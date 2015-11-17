import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { closeReduceColumnsModal, selectReduceColumnsModalColumn, selectReduceColumnsModalAllColumns } from '../../actions/ReduceColumnsModalActions';

import styles from './ReduceColumnsModal.sass';

import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';
import SelectGrid from '../Base/SelectGrid';
import Input from '../Base/Input';

class ReduceColumnsModal extends Component {

  render() {
    return (
      <BlockingModal
        closeAction={ this.props.closeReduceColumnsModal }
        heading={
          <span>Select Columns to Display</span>
        }
        footer={
          <div className={ styles.rightActions }>
            <RaisedButton primary onClick={ this.props.closeReduceColumnsModal }>Choose columns</RaisedButton>
          </div>
        }>
        <div>
          <SelectGrid
            heading="Columns to display"
            items={ this.props.columns }
            onSelectAllItems={ this.props.selectReduceColumnsModalAllColumns }
            onSelectItem={ this.props.selectReduceColumnsModalColumn }/>
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

export default connect(mapStateToProps, { closeReduceColumnsModal, selectReduceColumnsModalColumn, selectReduceColumnsModalAllColumns})(ReduceColumnsModal);
