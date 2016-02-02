import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import DropDownMenu from '../../Base/DropDownMenu';

export default class ConditionalSelector extends Component {
  constructor(props) {
    super(props);

    this.baseConditional = {
      conditionalIndex: this.props.conditionalIndex,
      fieldId: null,
      operator: '==',
      value: null
    };

    this.state = {
      conditional: this.baseConditional
    };
  }

  onSelectField(fieldId) {
    const conditional = { ...this.state.conditional, fieldId: fieldId, value: "ALL_VALUES" };
    this.setState({ conditional: conditional });
    if (this.state.conditional.value) {
      this.props.selectConditionalValue(conditional);
    }
  }

  onSelectFieldValue(fieldValueId) {
    const conditional = { ...this.state.conditional, value: fieldValueId };
    this.setState({ conditional: conditional });
    this.props.selectConditionalValue(conditional);
  }

  render() {
    const { fieldProperties, selectConditionalValue } = this.props;
    const { fieldId, value } = this.state.conditional;
    const selectedField = fieldProperties.find((item) => item.id == fieldId);
    const fieldValues = selectedField ? selectedField.values : [];

    return (
      <div className={ styles.fieldGroup }>
        <div style={{ display: 'flex' }}>
          <DropDownMenu
            className={ styles.conditionalDropdown }
            value={ fieldId }
            options={ fieldProperties.filter((item) => item.generalType == 'c') }
            valueMember="id"
            displayTextMember="name"
            onChange={ this.onSelectField.bind(this) }/>
          <DropDownMenu
            className={ styles.conditionalDropdown + (fieldId == null ? ' ' + styles.disabledDropdown : '') }
            value={ value }
            options={ fieldValues }
            valueMember="value"
            displayTextMember="label"
            onChange={ this.onSelectFieldValue.bind(this) }/>
        </div>
      </div>
    );
  }
}

ConditionalSelector.propTypes = {
  conditionalIndex: PropTypes.number.isRequired,
  fieldProperties: PropTypes.array.isRequired,
  selectConditionalValue: PropTypes.func
};
