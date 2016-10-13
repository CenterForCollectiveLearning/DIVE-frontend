import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { getNewQueryString } from '../../../helpers/helpers';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectIndependentVariable, selectDependentVariable, selectConditional } from '../../../actions/ComparisonActions';
import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class ComparisonSidebar extends Component {
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

  clickIndependentVariableId = (independentVariableId) => {
    const { project, datasetSelector, push, queryObject } = this.props;
    const newQueryString = getNewQueryString(queryObject, 'independentVariablesIds', independentVariableId, true);
    push(`/projects/${ project.id }/datasets/${ datasetSelector.datasetId }/analyze/comparison${ newQueryString }`);
  }

  render() {
    const { conditionals, fieldProperties, comparisonSelector, selectIndependentVariable, selectDependentVariable, selectConditional, independentVariablesIds, dependentVariablesIds } = this.props;

    console.log(dependentVariablesIds, independentVariablesIds);
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
                  onChange={ (v) => this.clickIndependentVariableId(parseInt(v)) } />
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
                      disabled: (dependentVariablesIds.indexOf(item.id) >= 0) || item.isId,
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ independentVariablesIds }
                  separated={ true }
                  onChange={ selectIndependentVariable } />
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
                onChange={ selectDependentVariable } />
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
  comparisonSelector: PropTypes.object.isRequired,
  queryObject: PropTypes.object.isRequired,
  independentVariablesIds: PropTypes.array.isRequired,
  dependentVariablesIds: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  const { project, datasetSelector, fieldProperties, comparisonSelector, conditionals } = state;

  return {
    project,
    conditionals,
    datasetSelector,
    fieldProperties,
    comparisonSelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectIndependentVariable, selectDependentVariable, selectConditional, getNewQueryString, push })(ComparisonSidebar);
