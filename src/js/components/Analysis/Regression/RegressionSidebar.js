import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectIndependentVariable, selectRegressionType, createInteractionTerm, selectInteractionTerm, deleteInteractionTerm, selectConditional } from '../../../actions/RegressionActions';
import { createURL, createInteractionTermName, filterInteractionTermSelection } from '../../../helpers/helpers.js';

import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import RaisedButton from '../../Base/RaisedButton';

const regressionTypes = [
  { value: 'linear', label: 'Linear' },
  { value: 'logistic', label: 'Logistic' }
];

export class RegressionSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      interactionVariables: [null, null]
    }
  }

  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.properties.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  onSelectDependentVariable(dependentVariable) {
    const { project, datasetSelector, fieldProperties, push } = this.props;

    const queryParams = { 'dependent-variable': dependentVariable };
    push(createURL(`/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/analyze/regression`, queryParams));
  }

  onSelectRegressionType(regressionType) {
    const { project, datasetSelector, regressionSelector, push } = this.props;

    const queryParams = { 'dependent-variable': regressionSelector.dependentVariableId, 'regression-type': regressionType };
    push(createURL(`/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/analyze/regression`, queryParams));
  }

  onAddInteractionTerm(dropDownNumber, independentVariableId) {
    const interactionVariables = this.state.interactionVariables;
    interactionVariables[dropDownNumber] = independentVariableId;

    this.setState({ interactionVariables: interactionVariables });
  }

  onCreateInteractionTerm() {
    const { createInteractionTerm, fieldProperties, project } = this.props;

    createInteractionTerm(project.properties.id, fieldProperties.datasetId, this.state.interactionVariables);
    this.setState({ interactionVariables: [null, null] })
  }

  render() {
    const { fieldProperties, regressionSelector, selectIndependentVariable, selectInteractionTerm, deleteInteractionTerm, conditionals, selectConditional } = this.props;
    const { interactionVariables } = this.state;

    const interactionTermNames = regressionSelector.interactionTermIds.map((idTuple) => {
      return fieldProperties.items.filter((property) => property.id == idTuple[0] || property.id == idTuple[1]).map((item) => item.name)
    })

    var shownRegressionTypes = regressionTypes;

    if(fieldProperties.items.length > 0) {
      const dependentVariableType = fieldProperties.items.find((property) => property.id == regressionSelector.dependentVariableId);
      if(dependentVariableType == 'decimal') {
        shownRegressionTypes = regressionTypes.filter((type) => type.value != 'logistic')
      }
    }

    return (
      <Sidebar selectedTab="regression">
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Regression Type">
            <DropDownMenu
              value={ regressionSelector.regressionType }
              options={ shownRegressionTypes }
              onChange={ this.onSelectRegressionType.bind(this) } />
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Dependent Variable (Y)">
            <DropDownMenu
              value={ parseInt(regressionSelector.dependentVariableId) }
              options={ fieldProperties.items.filter((property) => !property.isId) }
              valueMember="id"
              displayTextMember="name"
              onChange={ this.onSelectDependentVariable.bind(this) }/>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Explanatory Factors (X)">
            { fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'c').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == regressionSelector.dependentVariableId) || regressionSelector.dependentVariableId == null || ( item.generalType == 'c' && item.isUnique),
                      color: item.color
                    })
                  )}
                  displayTextMember="name"
                  colorMember="color"
                  valueMember="id"
                  externalSelectedItems={ regressionSelector.independentVariableIds }
                  separated={ true }
                  onChange={ selectIndependentVariable } />
              </div>
            }
            { fieldProperties.items.filter((property) => property.generalType == 't').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Temporal</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 't').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == regressionSelector.dependentVariableId) || regressionSelector.dependentVariableId == null || ( item.generalType == 'c' && item.isUnique),
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ regressionSelector.independentVariableIds }
                  separated={ true }
                  onChange={ selectIndependentVariable } />
              </div>
            }
            { fieldProperties.items.filter((property) => property.generalType == 'q').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'q').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == regressionSelector.dependentVariableId) || regressionSelector.dependentVariableId == null || ( item.generalType == 'c' && item.isUnique),
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ regressionSelector.independentVariableIds }
                  separated={ true }
                  onChange={ selectIndependentVariable } />
              </div>
            }
            { fieldProperties.interactionTerms.length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Interaction Terms</div>
                { fieldProperties.interactionTerms.length > 0 ?
                    <ToggleButtonGroup
                      toggleItems={ fieldProperties.interactionTerms.map((item) =>
                        new Object({
                          id: item.id,
                          name: createInteractionTermName(item.names)
                        })
                      )}
                      valueMember="id"
                      displayTextMember="name"
                      externalSelectedItems={ regressionSelector.interactionTermIds }
                      separated={ true }
                      onChange={ selectInteractionTerm }
                      onDelete={ deleteInteractionTerm } /> : null
                }
              </div>
            }
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <div>
          <SidebarGroup stacked={true} heading="Add Interaction Terms">
            <DropDownMenu
              width='50%'
              margin='2px'
              value={ interactionVariables[0] }
              options={ fieldProperties.items.filter((item) =>
                item.id != parseInt(regressionSelector.dependentVariableId) && item.id != interactionVariables[1]
                  && filterInteractionTermSelection(item.id, interactionVariables[1], fieldProperties.interactionTerms))
              }
              valueMember="id"
              displayTextMember="name"
              onChange={this.onAddInteractionTerm.bind(this, 0)} />
            <DropDownMenu
              width='50%'
              value={ interactionVariables[1] }
              options={ fieldProperties.items.filter((item) =>
                item.id != parseInt(regressionSelector.dependentVariableId) && item.id != interactionVariables[0]
                  && filterInteractionTermSelection(item.id, interactionVariables[0], fieldProperties.interactionTerms))
              }
              valueMember="id"
              displayTextMember="name"
              onChange={this.onAddInteractionTerm.bind(this, 1)} />
          </SidebarGroup>
          <RaisedButton altText="Add" label="Add" centered={true} onClick={this.onCreateInteractionTerm.bind(this)}/>
          </div>
        }
        { fieldProperties.items.length != 0 && conditionals.items.length != 0 &&
          <SidebarGroup heading="Filter by field">
            { conditionals.items.map((conditional, i) =>
              <div key={ `conditional-selector-${ i }` }>
                <ConditionalSelector
                  conditionalIndex={ i }
                  fieldProperties={ fieldProperties.items }
                  selectConditionalValue={ selectConditional }/>
              </div>
            )}
          </SidebarGroup>
        }
      </Sidebar>
    );
  }
}

RegressionSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  regressionSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, conditionals, datasetSelector, fieldProperties, regressionSelector } = state;
  return {
    project,
    conditionals,
    datasetSelector,
    fieldProperties,
    regressionSelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectRegressionType, selectIndependentVariable, createInteractionTerm, selectInteractionTerm, deleteInteractionTerm, selectConditional, push })(RegressionSidebar);
