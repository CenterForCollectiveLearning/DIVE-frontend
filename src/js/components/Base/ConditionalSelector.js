import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './ConditionalSelector.sass';

import { deleteConditional } from '../../actions/ConditionalsActions'
import Input from './Input';
import DropDownMenu from './DropDownMenu';
import ToggleButtonGroup from './ToggleButtonGroup';

export class ConditionalSelector extends Component {
  constructor(props) {
    super(props);

    this.combinators = [
      {
        value: 'and',
        label: 'AND'
      },
      {
        value: 'or',
        label: 'OR'
      }
    ];

    this.operators = [
      {
        value: '==',
        label: '=',
        validTypes: ['c', 'q', 't']
      },
      {
        value: '!=',
        label: '≠',
        validTypes: ['c', 'q', 't']
      },
      {
        value: '<',
        label: '<',
        validTypes: ['q', 't']
      },
      {
        value: '>',
        label: '>',
        validTypes: ['q', 't']
      },
      {
        value: '<=',
        label: '≤',
        validTypes: ['q', 't']
      },
      {
        value: '>=',
        label: '≥',
        validTypes: ['q', 't']
      },
    ];

    this.state = {
      conditionalId: this.props.conditionalId,
      fieldId: this.props.fieldId || this.props.fieldnull,
      operator: this.props.operator || '==',
      value: this.props.value || null,
      combinator: this.props.combinator || 'and'
    };

    this.baseConditional = {
      conditionalId: null,
      fieldId: null,
      operator: '==',
      value: null,
      combinator: 'and'
    }
  }

  updateConditional = (newProps, createNewConditional = false) => {
    const conditional = { ...this.state, ...newProps };

    this.setState(conditional);

    this.props.selectConditionalValue(conditional, createNewConditional);

    // Whether to create add new conditional

    // if (!isDefaultValue || (isDefaultValue && this.state.value)) {
    //   this.props.selectConditionalValue(conditional);
    // }
  }

  onSelectField = (fieldId) => {
    const selectedField = this.props.fieldProperties.find((item) => item.id == fieldId);
    const value = "ALL VALUES";
    const operator = "==";
    this.updateConditional({ fieldId: fieldId, value: value, operator: operator });
  }

  onClickDelete = () => {
    const { deleteConditional } = this.props;
    const { conditionalId } = this.state;
    deleteConditional(conditionalId);
    this.state = this.baseConditional;
  }

  onSelectOperator = (operator) => {
    this.updateConditional({ operator: operator });
  }

  onSelectCombinator = (combinator) => {
    this.updateConditional({ combinator: combinator });
  }

  onSelectFieldValue = (fieldValue) => {
    const createNewConditional = (this.state.value == 'ALL VALUES' && fieldValue != null);;
    this.updateConditional({ value: fieldValue }, createNewConditional);
  }

  onTypeFieldValue = (e) => {
    const val = e.target.value;
    const createNewConditional = (this.state.value == 'ALL VALUES' && val != null);
    this.updateConditional({ value: Number.parseInt(val) }, createNewConditional);
  }


  render() {
    const { fieldProperties, selectConditionalValue, conditionalIndex } = this.props;
    const { fieldId, operator, value, combinator, conditionalId } = this.state;
    const selectedField = fieldProperties.find((item) => item.id == fieldId);
    const fieldValues = selectedField ? selectedField.values : [];


    console.log(selectedField);
    const combinators = this.combinators
      .map((combinatorFromList) => new Object({ ...combinatorFromList, selected: combinator == combinatorFromList.value }));

    const operators = this.operators
      .filter((operatorFromList) => (!selectedField || operatorFromList.validTypes.indexOf(selectedField.generalType) != -1))
      .map((operatorFromList) => new Object({ ...operatorFromList, selected: operator == operatorFromList.value }));

    return (
      <div className={ styles.fieldGroup }>
        { conditionalIndex > 0 &&
          <ToggleButtonGroup
            className={ styles.conditionalCombinator }
            buttonClassName={ styles.conditionalCombinatorButton }
            toggleItems={ combinators }
            valueMember="value"
            displayTextMember="label"
            onChange={ this.onSelectCombinator } />
        }

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div className={ styles.deleteButton } onClick={ this.onClickDelete } />
          <DropDownMenu
            className={ styles.conditionalDropdown + ' ' + styles.sidebarDropdown + ' ' + styles.fieldDropdown }
            value={ fieldId }
            options={ fieldProperties.filter((f) => !f.isId) }
            valueMember="id"
            displayTextMember="name"
            onChange={ this.onSelectField }/>

          <div style={{ display: 'flex' }}>
            <DropDownMenu
              className={ styles.conditionalDropdown + ' ' + styles.sidebarDropdown + ' ' + styles.operatorDropdown + (fieldId == null ? ' ' + styles.disabledDropdown : '') }
              value={ operator }
              options={ operators }
              width="20%"
              valueMember="value"
              displayTextMember="label"
              onChange={ this.onSelectOperator }/>

            { (!selectedField || selectedField.generalType == 'c' || selectedField.scale == 'ordinal') &&
              <DropDownMenu
                className={ styles.conditionalDropdown + ' ' + styles.sidebarDropdown + ' ' + styles.fieldValueDropdown + (fieldId == null ? ' ' + styles.disabledDropdown : '') }
                value={ value }
                options={ fieldValues }
                width="80%"
                valueMember="value"
                displayTextMember="label"
                onChange={ this.onSelectFieldValue }/>
            }
            { selectedField && (selectedField.scale == 'continuous') &&
              <Input
                className={ styles.conditionalInput + (fieldId == null ? ' ' + styles.disabledInput : '') }
                placeholder={ `${ value }` }
                type="text"
                onChange={ this.onTypeFieldValue }/>
            }
          </div>
        </div>

      </div>
    );
  }
}

ConditionalSelector.propTypes = {
  conditionalIndex: PropTypes.number.isRequired,
  fieldProperties: PropTypes.array.isRequired,
  selectConditionalValue: PropTypes.func,
  conditional: PropTypes.object,
  fieldId: PropTypes.number,
  combinator: PropTypes.string,
  operator: PropTypes.string,
  value: PropTypes.any
};

function mapStateToProps(state) { return {} };

export default connect(mapStateToProps, { deleteConditional })(ConditionalSelector);
