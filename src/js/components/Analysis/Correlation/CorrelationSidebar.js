import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { updateQueryString } from '../../../helpers/helpers';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { setQueryString, selectConditional } from '../../../actions/CorrelationActions';
import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class CorrelationSidebar extends Component {
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

  clickQueryStringTrackedItem = (key, value) => {
    const { pathname, queryObject, setQueryString, push } = this.props;
    var newState = {};
    newState[key] = [ value ];

    const newQueryString = updateQueryString(queryObject, newState);
    setQueryString(newQueryString);
    push(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { fieldProperties, conditionals, correlationVariablesIds, electConditional } = this.props;
    const quantitativeVariables = this.props.fieldProperties.items.filter((item) => item.generalType == 'q')
    return (
      <Sidebar selectedTab="correlation">
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Correlation Variables">
            { fieldProperties.items.filter((property) => property.generalType == 'q').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ quantitativeVariables.map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      color: item.color,
                      disabled: item.isId
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ correlationVariablesIds }
                  separated={ true }
                  onChange={ (v) => this.clickQueryStringTrackedItem('correlationVariablesIds', parseInt(v)) } />
              </div>
            }
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

CorrelationSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  conditionals: PropTypes.object,
  pathname: PropTypes.string.isRequired,
  queryObject: PropTypes.object.isRequired,
  correlationVariablesIds: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties, conditionals } = state;
  return {
    project,
    datasetSelector,
    fieldProperties,
    setQueryString,
    conditionals
  };
}

export default connect(mapStateToProps, {
  fetchFieldPropertiesIfNeeded,
  selectConditional,
  updateQueryString,
  setQueryString,
  push
})(CorrelationSidebar);
