import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';

import { Button, Intent } from '@blueprintjs/core';

import { removeFromQueryString, parseFromQueryObject, queryObjectToQueryString, updateQueryString } from '../../../helpers/helpers';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { setPersistedQueryString, createInteractionTerm, selectInteractionTerm, deleteInteractionTerm, getRecommendation } from '../../../actions/RegressionActions';
import { selectConditional } from '../../../actions/ConditionalsActions';
import { createURL, createInteractionTermName, filterInteractionTermSelection } from '../../../helpers/helpers.js';

import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import RaisedButton from '../../Base/RaisedButton';

const recommendationTypes = [ {
  value: 'forwardR2',
  label: 'Forward Selection R-Squared'
}, {
  value: 'lasso',
  label: 'LASSO'
}]

const tableLayouts = [ {
  value: 'all',
  label: 'Only Complete Model',
}, {
  value: 'oneAtATime',
  label: 'One at a Time'
}, {
  value: 'leaveOneOut',
  label: 'Leave One Out'
}]

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

    if (project.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId)
    }
  }

  onSelectDependentVariable(dependentVariable) {
    const { project, datasetSelector, fieldProperties, push } = this.props;

    const queryParams = { 'dependent-variable': dependentVariable };
    push(createURL(`/projects/${ project.id }/datasets/${ datasetSelector.datasetId }/analyze/regression`, queryParams));
  }

  onAddInteractionTerm(dropDownNumber, independentVariableId) {
    const interactionVariables = this.state.interactionVariables;
    interactionVariables[dropDownNumber] = independentVariableId;

    this.setState({ interactionVariables: interactionVariables });
  }

  onCreateInteractionTerm() {
    const { createInteractionTerm, fieldProperties, project } = this.props;

    createInteractionTerm(project.id, fieldProperties.datasetId, this.state.interactionVariables);
    this.setState({ interactionVariables: [null, null] })
  }

  clickClearKeyFromQueryString = (key) => {
    const { pathname, queryObject, setPersistedQueryString, push } = this.props;
    const newQueryString = removeFromQueryString(queryObject, key);
    setPersistedQueryString(newQueryString, true);
    push(`${ pathname }${ newQueryString }`);
  }

  clickQueryStringTrackedItem = (newObj) => {
    const { pathname, queryObject, setPersistedQueryString, push } = this.props;
    const newQueryString = updateQueryString(queryObject, newObj);
    setPersistedQueryString(newQueryString);
    push(`${ pathname }${ newQueryString }`);
  }

  setRecommendedState = (fieldProperties) =>{
    const { project, datasetSelector, dependentVariableId, pathname, queryObject, replace, setPersistedQueryString, getRecommendation } = this.props;

    function setRecommendationCallback(json) {
      json = { ...json, recommended: true };
      const newQueryString = queryObjectToQueryString(json);
      console.log(json, queryObject, newQueryString);
      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }

    getRecommendation(project.id, datasetSelector.datasetId, fieldProperties.items, setRecommendationCallback, dependentVariableId);
  }

  render() {
    const {
      fieldProperties,
      regressionSelector,
      selectInteractionTerm,
      deleteInteractionTerm,
      conditionals,
      selectConditional,
      recommended,
      recommendationType,
      tableLayout,
      regressionType,
      dependentVariableId,
      independentVariablesIds,
    } = this.props;

    const { interactionVariables } = this.state;

    const interactionTermNames = regressionSelector.interactionTermIds.map((idTuple) => {
      return fieldProperties.items.filter((property) => property.id == idTuple[0] || property.id == idTuple[1]).map((item) => item.name)
    })

    var shownRegressionTypes = regressionTypes;

    if(fieldProperties.items.length > 0) {
      const dependentVariableType = fieldProperties.items.find((property) => property.id == dependentVariableId);
      if(dependentVariableType == 'decimal') {
        shownRegressionTypes = regressionTypes.filter((type) => type.value != 'logistic')
      }
    }

    return (
      <Sidebar selectedTab="regression">
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Recommendation Type" helperText='regression'>
            <Button
              className={ 'pt-fill ' + styles.recommendModelButton + ( recommended ? ' .pt-active' : '' )}
              iconName='predictive-analysis'
              text={ recommended ? 'Recommended Model' : 'Recommend Model' }
              intent={ recommended ? Intent.NONE : Intent.PRIMARY }
              disabled={ recommended }
              onClick={ this.setRecommendedState }
            />
            <DropDownMenu
              value={ recommendationType }
              valueMember='value'
              displayTextMember='label'
              options={ recommendationTypes }
              onChange={ (v) => this.clickQueryStringTrackedItem({ recommendationType: v }) }/>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Table Layout Mode">
            <DropDownMenu
              value={ tableLayout }
              options={ tableLayouts }
              onChange={ (v) => this.clickQueryStringTrackedItem({ tableLayout: v }) }/>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Regression Type">
            <DropDownMenu
              value={ regressionType }
              options={ shownRegressionTypes }
              onChange={ (v) => this.clickQueryStringTrackedItem({ regressionType: v }) }/>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Dependent Variable (Y)">
            <DropDownMenu
              value={ parseInt(dependentVariableId) }
              options={ fieldProperties.items.filter((property) => !property.isId) }
              valueMember="id"
              displayTextMember="name"
              onChange={ (v) => this.clickQueryStringTrackedItem({ dependentVariableId: parseInt(v) })}/>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Explanatory Factors (X)">
            { fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupHeader }>
                  <div className={ styles.fieldGroupLabel }>Categorical</div>
                  { independentVariablesIds.length > 0 &&
                    <div className={ styles.fieldGroupAction }
                      onClick={ (v) => this.clickClearKeyFromQueryString('independentVariablesIds') }>
                      Deselect All
                    </div>
                  }
                </div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'c').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (item.id == dependentVariableId) || dependentVariableId == null || ( item.generalType == 'c' && item.isUnique),
                      color: item.color
                    })
                  )}
                  displayTextMember="name"
                  colorMember="color"
                  valueMember="id"
                  externalSelectedItems={ independentVariablesIds }
                  separated={ true }
                  onChange={ (v) => this.clickQueryStringTrackedItem({ independentVariablesIds: [ parseInt(v) ], recommended: false }) } />
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
                      disabled: (item.id == dependentVariableId) || dependentVariableId == null || ( item.generalType == 'c' && item.isUnique),
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ independentVariablesIds }
                  separated={ true }
                  onChange={ (v) => this.clickQueryStringTrackedItem({ independentVariablesIds: [ parseInt(v) ], recommended: false }) } />
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
                      disabled: (item.id == dependentVariableId) || dependentVariableId == null || ( item.generalType == 'c' && item.isUnique),
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ independentVariablesIds }
                  separated={ true }
                  onChange={ (v) => this.clickQueryStringTrackedItem({ independentVariablesIds: [ parseInt(v) ], recommended: false }) } />
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
          <SidebarGroup
            className={ styles.interactionTermsSidebarGroup }
            stacked={ true }
            heading="Add Interaction Terms"
          >
            <div className={ styles.sideBySideDropdowns }>
              <DropDownMenu
                width='50%'
                margin='2px'
                value={ interactionVariables[0] }
                options={ fieldProperties.items.filter((item) =>
                  item.id != parseInt(dependentVariableId) && item.id != interactionVariables[1]
                    && filterInteractionTermSelection(item.id, interactionVariables[1], fieldProperties.interactionTerms))
                }
                valueMember="id"
                displayTextMember="name"
                onChange={this.onAddInteractionTerm.bind(this, 0)} />
              <DropDownMenu
                width='50%'
                value={ interactionVariables[1] }
                options={ fieldProperties.items.filter((item) =>
                  item.id != parseInt(dependentVariableId) && item.id != interactionVariables[0]
                    && filterInteractionTermSelection(item.id, interactionVariables[0], fieldProperties.interactionTerms))
                }
                valueMember="id"
                displayTextMember="name"
                onChange={this.onAddInteractionTerm.bind(this, 1)} />
            </div>
            <RaisedButton altText="Add" label="Add" centered={true} onClick={this.onCreateInteractionTerm.bind(this)}/>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 && conditionals.items.length != 0 &&
          <SidebarGroup heading="Filter by field">
            { conditionals.items.map((conditional, i) =>
              <div key={ conditional.conditionalId }>
                <ConditionalSelector
                  conditionalIndex={ i }
                  conditionalId={ conditional.conditionalId }
                  fieldId={ conditional.fieldId }
                  combinator={ conditional.combinator }
                  operator={ conditional.operator }
                  value={ conditional.value }
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
  regressionSelector: PropTypes.object.isRequired,
  dependentVariableId: PropTypes.number.isRequired,
  independentVariablesIds: PropTypes.array.isRequired,
  recommended: PropTypes.bool,
  regressionType: PropTypes.string,
  recommendationType: PropTypes.string,
  tableLayout: PropTypes.string
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

export default connect(mapStateToProps, {
  fetchFieldPropertiesIfNeeded,
  createInteractionTerm,
  selectInteractionTerm,
  deleteInteractionTerm,
  selectConditional,
  setPersistedQueryString,
  getRecommendation,
  replace,
  push
})(RegressionSidebar);
