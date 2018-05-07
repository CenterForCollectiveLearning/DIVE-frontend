import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { removeFromQueryString, updateQueryString } from '../../../helpers/helpers';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { setPersistedQueryString, selectBinningConfigX, selectBinningConfigY, selectAggregationIndependentVariable, selectAggregationVariable, selectAggregationFunction, selectAggregationWeightVariable } from '../../../actions/AggregationActions';
import { selectConditional } from '../../../actions/ConditionalsActions';
import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import SidebarCategoryGroup from '../../Base/SidebarCategoryGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import BinningSelector from '../../Base/BinningSelector';

export class AggregationSidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.id && datasetSelector.id && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.id != this.props.datasetSelector.id;

    if (project.id && datasetSelector.id && (datasetIdChanged || !fieldProperties.loaded) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.id)
    }
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

  render() {
    const { fieldProperties, aggregationSelector, selectAggregationIndependentVariable, selectBinningConfigX, selectBinningConfigY, conditionals, selectConditional, aggregationVariablesIds, aggregationDependentVariableId, weightVariableId, aggregationFunction } = this.props;
    const { binningConfigX, binningConfigY } = aggregationSelector;
    const nonAggregationVariables = fieldProperties.items.filter((item) => aggregationVariablesIds.indexOf(item.id) < 0)
    const aggregationOptions = [{'id': 'count', 'name' : 'count'}, ...nonAggregationVariables.filter((item) => (item.generalType == 'q' || item.generalType == 't'))]

    const numAggregationVariables = fieldProperties.items.filter((item) => (item.generalType == 'q' || item.generalType == 't') && aggregationVariablesIds.indexOf(item.id) >= 0 )
    const n_q = numAggregationVariables.length;

    return (
      <Sidebar>
        { fieldProperties.items.length != 0 &&
          <SidebarCategoryGroup heading="Variable Selection" iconName="variable">
            <SidebarGroup
              heading="Independent Variables"
              rightAction={ aggregationVariablesIds.length > 0 &&
                <span className={ 'pt-icon-standard pt-icon-delete' }
                  onClick={ (v) => this.clickClearKeyFromQueryString('aggregationVariablesIds') } />
              }
            >
              { fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
                <div className={ styles.fieldGroup }>
                  <div className={ styles.fieldGroupHeader }>
                    <span className={ styles.fieldGroupLabel }>Categorical</span>
                    <span className={ "pt-icon-standard pt-icon-font " + styles.generalTypeIcon } />
                  </div>
                  <ToggleButtonGroup
                    toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'c' && !property.isId).map((item) =>
                      new Object({
                        id: item.id,
                        name: item.name,
                        disabled: (item.id == aggregationDependentVariableId),
                        color: item.color
                      })
                    )}
                    displayTextMember="name"
                    valueMember="id"
                    colorMember="color"
                    externalSelectedItems={ aggregationVariablesIds }
                    separated={ true }
                    onChange={ (v) => this.clickQueryStringTrackedItem({ aggregationVariablesIds: [ parseInt(v) ]}) } />
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
                        disabled: (item.id == aggregationDependentVariableId),
                        color: item.color
                      })
                    )}
                    valueMember="id"
                    colorMember="color"
                    displayTextMember="name"
                    externalSelectedItems={ aggregationVariablesIds }
                    separated={ true }
                    onChange={ (v) => this.clickQueryStringTrackedItem({ aggregationVariablesIds: [ parseInt(v) ]}) } />
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
                        disabled: (item.id == aggregationDependentVariableId) || item.isId,
                        color: item.color
                      })
                    )}
                    valueMember="id"
                    colorMember="color"
                    displayTextMember="name"
                    externalSelectedItems={ aggregationVariablesIds }
                    separated={ true }
                    onChange={ (v) => this.clickQueryStringTrackedItem({ aggregationVariablesIds: [ parseInt(v) ]}) } />
                </div>
              }
            </SidebarGroup>
          </SidebarCategoryGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Aggregate on">
            <DropDownMenu
              value={ aggregationDependentVariableId }
              options={ aggregationOptions }
              valueMember="id"
              displayTextMember="name"
              onChange={ (v) => this.clickQueryStringTrackedItem({ aggregationDependentVariableId: v }) }/>
          </SidebarGroup>
        }
        { aggregationDependentVariableId != 'count' &&
          <SidebarGroup heading="By">
            <DropDownMenu
              value={ aggregationFunction }
              options={ [{ 'id':'SUM', 'name':'sum' }, { 'id':'MEAN', 'name':'mean' }] }
              valueMember="id"
              displayTextMember="name"
              onChange={ (v) => this.clickQueryStringTrackedItem({ aggregationFunction: v }) }/>
          </SidebarGroup>
        }
        { aggregationFunction == 'MEAN' && aggregationDependentVariableId != 'count' &&
          <SidebarGroup heading="Weighted by:">
            <DropDownMenu
              value={ weightVariableId }
              options={ [{ 'id':'UNIFORM', 'name':'uniform' }, ...fieldProperties.items.filter((item) => item.generalType == 'q' && item.id != aggregationDependentVariableId)] }
              valueMember="id"
              displayTextMember="name"
              onChange={ (v) => this.clickQueryStringTrackedItem({ weightVariableId: v }) }/>
          </SidebarGroup>
        }
        { n_q >= 1 &&
          <BinningSelector
            config={ binningConfigX }
            selectBinningConfig={ selectBinningConfigX }
            name={ numAggregationVariables[0].name }/>
        }
        { n_q == 2 &&
          <BinningSelector
            config={ binningConfigY }
            selectBinningConfig={ selectBinningConfigY }
            name={ numAggregationVariables[1].name }/>
        }
        { fieldProperties.items.length != 0 && conditionals.items.length != 0 &&
          <SidebarCategoryGroup heading="Filters" iconName="filter">
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
          </SidebarCategoryGroup>
        }
      </Sidebar>
    );
  }
}

AggregationSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  aggregationSelector: PropTypes.object.isRequired,
  conditionals: PropTypes.object,
  queryObject: PropTypes.object.isRequired,
  aggregationVariablesIds: PropTypes.array.isRequired,
  aggregationDependentVariableId: PropTypes.any,
  aggregationFunction: PropTypes.string,
  weightVariableId: PropTypes.string,
};

function mapStateToProps(state) {
  const { project, conditionals, datasetSelector, fieldProperties, aggregationSelector } = state;
  return {
    project,
    datasetSelector,
    fieldProperties,
    aggregationSelector,
    conditionals
  };
}

export default connect(mapStateToProps, {
  fetchFieldPropertiesIfNeeded,
  selectBinningConfigX,
  selectBinningConfigY,
  selectAggregationIndependentVariable,
  selectAggregationVariable,
  selectAggregationFunction,
  selectAggregationWeightVariable,
  selectConditional,
  updateQueryString,
  setPersistedQueryString,
  push
})(AggregationSidebar);
