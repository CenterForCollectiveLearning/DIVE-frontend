import React, { Component, PropTypes } from 'react';

import styles from '../Visualizations.sass';

import DropDownMenu from '../../Base/DropDownMenu';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';

export default class ConditionalSelector extends Component {
  constructor(props) {
    super(props);

    this.baseConditional = {
      conditionalIndex: this.props.conditionalIndex,
      fieldId: null,
      operator: '==',
      value: null,
      combinator: 'and'
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

  onSelectCombinator(combinator) {
    const conditional = { ...this.state.conditional, combinator: combinator };
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
    const { fieldId, value, combinator } = this.state.conditional;
    const selectedField = fieldProperties.find((item) => item.id == fieldId);
    const fieldValues = selectedField ? selectedField.values : [];

    const CONDITIONAL_COMBINATORS = [
      {
        id: 'and',
        name: 'AND',
        selected: combinator == 'and'
      },
      {
        id: 'or',
        name: 'OR',
        selected: combinator == 'or'
      }
    ];

    return (
      <div className={ styles.fieldGroup }>
        { this.state.conditional.conditionalIndex > 0 &&
          <ToggleButtonGroup
            className={ styles.conditionalCombinator }
            buttonClassName={ styles.conditionalCombinatorButton }
            toggleItems={ CONDITIONAL_COMBINATORS }
            valueMember="id"
            displayTextMember="name"
            onChange={ this.onSelectCombinator.bind(this) } />
        }

        <div style={{ display: 'flex' }}>
          <DropDownMenu
            className={ styles.conditionalDropdown + ' ' + styles.sidebarDropdown }
            value={ fieldId }
            options={ fieldProperties.filter((item) => item.generalType == 'c') }
            valueMember="id"
            displayTextMember="name"
            onChange={ this.onSelectField.bind(this) }/>
          <DropDownMenu
            className={ styles.conditionalDropdown + ' ' + styles.sidebarDropdown + (fieldId == null ? ' ' + styles.disabledDropdown : '') }
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
