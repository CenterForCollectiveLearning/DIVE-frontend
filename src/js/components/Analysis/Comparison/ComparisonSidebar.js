import _ from 'underscore';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectIndependentVariables, selectDependentVariables, selectConditional } from '../../../actions/ComparisonActions';
import styles from '../Analysis.sass';

import { createURL, setQueryString } from '../../../helpers/helpers';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class ComparisonSidebar extends Component {
  constructor(props) {
    super(props);

    this.onClickIndependentVariable = this.onClickIndependentVariable.bind(this)
    this.onClickDependentVariable = this.onClickDependentVariable.bind(this)
  }

  componentWillMount(props) {
    const {
      project,
      datasetSelector,
      fieldProperties,
      fetchFieldPropertiesIfNeeded,
      queryDependentVariablesIds,
      queryIndependentVariablesIds,
      selectIndependentVariables,
      selectDependentVariables
    } = this.props;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId);
    }

    // Selecting based on initial query string
    if (queryDependentVariablesIds.length) {
      selectDependentVariables(queryDependentVariablesIds);
    }
    if (queryIndependentVariablesIds.length) {
      selectIndependentVariables(queryIndependentVariablesIds);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      datasetSelector,
      queryDependentVariablesIds,
      queryIndependentVariablesIds,
      selectIndependentVariables,
      selectDependentVariables
    } = this.props;

    const datasetIdChanged = nextProps.datasetSelector.datasetId != datasetSelector.datasetId;
    if (nextProps.project.properties.id && nextProps.datasetSelector.datasetId && (datasetIdChanged || !nextProps.fieldProperties.items.length) && !nextProps.fieldProperties.fetching) {
      nextProps.fetchFieldPropertiesIfNeeded(nextProps.project.properties.id, nextProps.datasetSelector.datasetId)
    }

    // Handling query string changes
    const queryIndependentVariablesIdsChanged = _.union(_.difference(nextProps.queryIndependentVariablesIds, queryIndependentVariablesIds), _.difference(queryIndependentVariablesIds, nextProps.queryIndependentVariablesIds));
    if (queryIndependentVariablesIdsChanged.length) {
      selectIndependentVariables(queryIndependentVariablesIdsChanged)
    }

    const queryDependentVariablesIdsChanged = _.union(_.difference(nextProps.queryDependentVariablesIds, queryDependentVariablesIds), _.difference(queryDependentVariablesIds, nextProps.queryDependentVariablesIds));
    if (queryDependentVariablesIdsChanged.length) {
      selectDependentVariables(queryDependentVariablesIdsChanged)
    }
  }

  onClickIndependentVariable(selectedField) {
    const { project, datasetSelector, comparisonSelector, push } = this.props;
    const { dependentVariablesIds, independentVariablesIds } = comparisonSelector;
    selectedField = parseInt(selectedField);

    // TODO Abstract this
    const existingFields = independentVariablesIds.slice();
    var newFields = independentVariablesIds.slice();
    if (existingFields.find((existingField) => existingField == selectedField)) {  // If selected field in existing fields, remove
      newFields = newFields.filter((existingField) => existingField != selectedField);
    } else {  // Else add
      newFields.push(selectedField);
    }

    push(createURL(`/project/${ project.properties.id }/dataset/${ datasetSelector.datasetId }/analyze/comparison`, {
      dependentVariablesIds: dependentVariablesIds,
      independentVariablesIds: newFields
    }));
  }

  onClickDependentVariable(selectedField) {
    const { project, datasetSelector, comparisonSelector, push } = this.props;
    const { dependentVariablesIds, independentVariablesIds } = comparisonSelector;
    selectedField = parseInt(selectedField);

    const existingFields = dependentVariablesIds.slice();
    var newFields = dependentVariablesIds.slice();
    if (existingFields.find((existingField) => existingField == selectedField)) {  // If selected field in existing fields, remove
      newFields = newFields.filter((existingField) => existingField != selectedField);
    } else {  // Else add
      newFields.push(selectedField);
    }

    push(createURL(`/project/${ project.properties.id }/dataset/${ datasetSelector.datasetId }/analyze/comparison`, {
      dependentVariablesIds: newFields,
      independentVariablesIds: independentVariablesIds
    }));
  }

  render() {
    const { conditionals, fieldProperties, comparisonSelector, selectConditional } = this.props;
    const { dependentVariablesIds, independentVariablesIds } = comparisonSelector;

    return (
      <Sidebar selectedTab="comparison">
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Independent Variables">
            { fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
                <ToggleButtonGroup
                  toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'c').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      disabled: (dependentVariablesIds.indexOf(item.id) >= 0) || item.isId,
                      color: item.color
                    })
                  )}
                  displayTextMember="name"
                  valueMember="id"
                  colorMember="color"
                  externalSelectedItems={ independentVariablesIds }
                  separated={ true }
                  onChange={ this.onClickIndependentVariable } />
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
                      disabled: (dependentVariablesIds.indexOf(item.id) >= 0) || item.isId,
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ independentVariablesIds }
                  separated={ true }
                  onChange={ this.onClickDependentVariable } />
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
                      disabled: (dependentVariablesIds.indexOf(item.id) >= 0) || item.isId,
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ independentVariablesIds }
                  separated={ true }
                  onChange={ this.onClickIndependentVariable } />
              </div>
            }
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Dependent Variables">
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupLabel }>Quantitative</div>
              <ToggleButtonGroup
                toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'q').map((item) =>
                  new Object({
                    id: item.id,
                    name: item.name,
                    disabled: (independentVariablesIds.indexOf(item.id) >= 0 || item.generalType == 'c' || item.isId),
                    color: item.color
                  })
                )}
                valueMember="id"
                colorMember="color"
                displayTextMember="name"
                externalSelectedItems={ dependentVariablesIds }
                separated={ true }
                onChange={ this.onClickDependentVariable } />
            </div>
          </SidebarGroup>
        }
        { fieldProperties.items.length != 0 && conditionals.items.length != 0 &&
          <SidebarGroup heading="Filter by field">
            { conditionals.items.map((conditional, i) =>
              <div key={ `conditional-selector-${ i }` }>
                <ConditionalSelector
                  fieldId={ conditional.fieldId }
                  combinator={ conditional.combinator }
                  operator={ conditional.operator }
                  value={ conditional.value }
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

ComparisonSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  comparisonSelector: PropTypes.object.isRequired,
  queryDependentVariablesIds: PropTypes.array.isRequired,
  queryIndependentVariablesIds: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties, comparisonSelector, conditionals } = state;
  return {
    project,
    conditionals,
    datasetSelector,
    fieldProperties,
    comparisonSelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectIndependentVariables, selectDependentVariables, selectConditional, push })(ComparisonSidebar);
