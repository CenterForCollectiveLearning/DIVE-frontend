import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';

import { Button, Intent, Position } from '@blueprintjs/core';

import { removeFromQueryString, parseFromQueryObject, queryObjectToQueryString, updateQueryString } from '../../../helpers/helpers';
import { fetchFieldPropertiesIfNeeded, selectTransformationFunction } from '../../../actions/FieldPropertiesActions';
import { setPersistedQueryString, createInteractionTerm, selectInteractionTerm, deleteInteractionTerm, getRecommendation } from '../../../actions/RegressionActions';
import { selectConditional } from '../../../actions/ConditionalsActions';
import { createURL, createInteractionTermName, filterInteractionTermSelection } from '../../../helpers/helpers.js';

import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarCategoryGroup from '../../Base/SidebarCategoryGroup';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import RaisedButton from '../../Base/RaisedButton';

const recommendationTypes = [ {
  value: 'forwardR2',
  label: <span>Forward Selection on R<sup>2</sup></span>
}, {
//   value: 'forwardF',
//   label: 'Forward Selection on F'
// }, {
//   value: 'rfe',
//   label: 'Recursive Feature Elimination'
// }, {
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
      interactionVariables: [ null, null ]
    }
  }

  componentWillMount(props) {
    const { project, datasetId, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.id && datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetId, dependentVariableId, fieldProperties, fetchFieldPropertiesIfNeeded, recommendationType, recommendationResult, regressionSelector } = nextProps;
    const datasetIdChanged = datasetId != this.props.datasetId;
    const recommendationTypeChanged = recommendationType != this.props.recommendationType;

    if (project.id && datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetId)
    }

    if (project.id && datasetId && dependentVariableId && !regressionSelector.recommendationResult.loading && (this.props.recommendationType && recommendationTypeChanged)) {
      this.setRecommendedState(nextProps);
    }
  }

  onSelectDependentVariable(dependentVariable) {
    const { project, datasetId, fieldProperties, push } = this.props;

    const queryParams = { 'dependent-variable': dependentVariable };
    push(createURL(`/projects/${ project.id }/datasets/${ datasetId }/analyze/regression`, queryParams));
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

  setRecommendedState = (passedProps) => {
    const props = (passedProps && Object.keys(passedProps).length != 0) ? passedProps : this.props;
    const { project, datasetId, dependentVariableId, pathname, queryObject, replace, setPersistedQueryString, getRecommendation, recommendationType } = props;

    function setRecommendationCallback(json) {
      const newQueryString = queryObjectToQueryString(json);
      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }

    getRecommendation(project.id, datasetId, setRecommendationCallback, dependentVariableId, recommendationType);
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
      selectTransformationFunction
    } = this.props;

    const { interactionVariables } = this.state;

    const interactionTermNames = regressionSelector.interactionTermIds.map((idTuple) => {
      return fieldProperties.items.filter((property) => property.id == idTuple[0] || property.id == idTuple[1]).map((item) => item.name)
    })

    var shownRegressionTypes = regressionTypes;

    if(fieldProperties.items.length > 0) {
      const dependentVariable = fieldProperties.items.find((property) => property.id == dependentVariableId);

      if(dependentVariable && dependentVariable.scale == 'nominal') {
        shownRegressionTypes = regressionTypes.filter((type) => type.value == 'logistic')
      }
      if(dependentVariable && dependentVariable.scale != 'nominal') {
        shownRegressionTypes = regressionTypes.filter((type) => type.value != 'logistic')
      }      
    }

    const initialCollapse = (fieldProperties.items.length > 10);

    return (
      <Sidebar selectedTab="regression">
        { fieldProperties.items.length != 0 &&
          <SidebarCategoryGroup heading="Regression Options" initialCollapse={ initialCollapse } iconName='predictive-analysis'>
            <Button
              className={ 'pt-fill ' + styles.recommendModelButton + ( recommended ? ' .pt-active' : '' )}
              iconName='predictive-analysis'
              text={ recommended ? 'Recommended Model' : 'Recommend Model' }
              intent={ recommended ? Intent.NONE : Intent.PRIMARY }
              disabled={ recommended }
              onClick={ () => this.setRecommendedState() }
              loading={ regressionSelector.recommendationResult.loading }
            />
            <SidebarGroup heading="Recommendation Type" helperText='regressionModel' helperTextPosition={ Position.LEFT_TOP }>
              <DropDownMenu
                value={ recommendationType }
                valueMember='value'
                displayTextMember='label'
                options={ recommendationTypes }
                onChange={ (v) => this.clickQueryStringTrackedItem({ recommendationType: v }) }/>
            </SidebarGroup>
            <SidebarGroup heading="Table Layout Mode" helperText='tableLayout'>
              <DropDownMenu
                value={ tableLayout }
                options={ tableLayouts }
                onChange={ (v) => this.clickQueryStringTrackedItem({ tableLayout: v }) }/>
            </SidebarGroup>
            <SidebarGroup heading="Regression Type" helperText='regressionType'>
              <DropDownMenu
                value={ regressionType }
                options={ shownRegressionTypes }
                onChange={ (v) => this.clickQueryStringTrackedItem({ regressionType: v }) }/>
            </SidebarGroup>
          </SidebarCategoryGroup>
        }
        <SidebarCategoryGroup heading="Variable Selection" iconName="variable">
          { fieldProperties.items.length != 0 &&
            <SidebarGroup heading="Dependent Variable (Y)">
              <DropDownMenu
                value={ parseInt(dependentVariableId) }
                options={ fieldProperties.items.filter((property) => !property.isId) }
                valueMember="id"
                displayTextMember="name"
                onChange={ (v) => this.clickQueryStringTrackedItem({ dependentVariableId: parseInt(v), recommended: false })}/>
            </SidebarGroup>
          }
          { fieldProperties.items.length != 0 &&
            <SidebarGroup
              heading="Explanatory Factors (X)"
              rightAction={ independentVariablesIds.length > 0 &&
                <span className={ 'pt-icon-standard pt-icon-delete' }
                  onClick={ (v) => this.clickClearKeyFromQueryString('independentVariablesIds') } />
              }
            >
              { fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
                <div className={ styles.fieldGroup }>
                  <div className={ styles.fieldGroupHeader }>
                    <span className={ styles.fieldGroupLabel }>Categorical</span>
                    <span className={ "pt-icon-standard pt-icon-font " + styles.generalTypeIcon } />
                  </div>
                  <ToggleButtonGroup
                    toggleItems={ fieldProperties.items.filter((p) => p.generalType == 'c' && !p.isId).map((item) =>
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
                  <div className={ styles.fieldGroupHeader }>
                    <span className={ styles.fieldGroupLabel }>Temporal</span>
                    <span className={ "pt-icon-standard pt-icon-time " + styles.generalTypeIcon } />
                  </div>
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
                <div className={ styles.fieldGroupHeader }>
                  <span className={ styles.fieldGroupLabel }>Quantitative</span>
                  <span className={ "pt-icon-standard pt-icon-numerical " + styles.generalTypeIcon } />
                </div>
                  <ToggleButtonGroup
                    toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'q').map((item) =>
                      new Object({
                        id: item.id,
                        name: item.name,
                        disabled: (item.id == dependentVariableId) || dependentVariableId == null || ( item.generalType == 'c' && item.isUnique),
                        color: item.color,
                        transformations: item.transformations
                      })
                    )}
                    valueMember="id"
                    colorMember="color"
                    splitMenuItemsMember="transformations"
                    displayTextMember="name"
                    externalSelectedItems={ independentVariablesIds }
                    separated={ true }
                    selectMenuItem={ selectTransformationFunction }
                    onChange={ (v) => this.clickQueryStringTrackedItem({ independentVariablesIds: [ parseInt(v) ], recommended: false }) } />
                </div>
              }
              { fieldProperties.interactionTerms.length > 0 &&
                <div className={ styles.fieldGroup }>
                  <div className={ styles.fieldGroupHeader }>
                    <span className={ styles.fieldGroupLabel }>Interaction Terms</span>
                    <span className={ "pt-icon-standard pt-icon-unresolve " + styles.generalTypeIcon } />
                  </div>
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
              heading="Interaction Terms"
            >
              <div className={ styles.sideBySideDropdowns }>
                <DropDownMenu
                  width='50%'
                  margin='2px'
                  value={ interactionVariables[0] }
                  options={ fieldProperties.items.filter((item) =>
                    !item.isId
                      && item.id != parseInt(dependentVariableId) && item.id != interactionVariables[1]
                      && filterInteractionTermSelection(item.id, interactionVariables[1], fieldProperties.interactionTerms))
                  }
                  valueMember="id"
                  displayTextMember="name"
                  onChange={ this.onAddInteractionTerm.bind(this, 0) } />
                <DropDownMenu
                  width='50%'
                  value={ interactionVariables[1] }
                  options={ fieldProperties.items.filter((item) =>
                    !item.isId
                      && item.id != parseInt(dependentVariableId) && item.id != interactionVariables[0]
                      && filterInteractionTermSelection(item.id, interactionVariables[0], fieldProperties.interactionTerms))
                  }
                  valueMember="id"
                  displayTextMember="name"
                  onChange={ this.onAddInteractionTerm.bind(this, 1) } />
              </div>
              {
                interactionVariables[0] && interactionVariables[1] &&
                <Button
                  intent={ Intent.PRIMARY }
                  className="pt-fill"
                  text="Add"
                  onClick={ this.onCreateInteractionTerm.bind(this) }
                />
              }

            </SidebarGroup>
          }
          </SidebarCategoryGroup>
          <SidebarCategoryGroup heading="Filters" initialCollapse={ true } iconName="filter">
            { fieldProperties.items.length != 0 && conditionals.items.length != 0 && conditionals.items.map((conditional, i) =>
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
        </SidebarCategoryGroup>
      </Sidebar>
    );
  }
}

RegressionSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetId: PropTypes.string.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  regressionSelector: PropTypes.object.isRequired,
  dependentVariableId: PropTypes.number,
  independentVariablesIds: PropTypes.array,
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
    datasetId: datasetSelector.id,
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
  selectTransformationFunction,
  replace,
  push
})(RegressionSidebar);
