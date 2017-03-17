import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { removeFromQueryString, updateQueryString } from '../../../helpers/helpers';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { setPersistedQueryString } from '../../../actions/CorrelationActions';
import { selectConditional } from '../../../actions/ConditionalsActions';
import styles from '../Analysis.sass';

import ConditionalSelector from '../../Base/ConditionalSelector';
import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import SidebarCategoryGroup from '../../Base/SidebarCategoryGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class CorrelationSidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.id && datasetSelector.id && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.id != this.props.datasetSelector.id;

    if (project.id && datasetSelector.id && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
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
    const { fieldProperties, conditionals, correlationVariablesIds, selectConditional } = this.props;
    const quantitativeVariables = this.props.fieldProperties.items.filter((item) => item.generalType == 'q')
    return (
      <Sidebar selectedTab="correlation">
        <SidebarCategoryGroup
          heading="Variable Selection"
          iconName="variable"
          rightAction={ correlationVariablesIds.length > 0 &&
            <span className={ 'pt-icon-standard pt-icon-delete'}
              onClick={ (v) => this.clickClearKeyFromQueryString('correlationVariablesIds') } />
          }>
          { fieldProperties.items.length != 0 && fieldProperties.items.filter((property) => property.generalType == 'q').length > 0 &&
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupHeader }>
                <span className={ styles.fieldGroupLabel }>Quantitative</span>
                <span className={ "pt-icon-regular pt-icon-numerical " + styles.generalTypeIcon } />
              </div>
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
                onChange={ (v) => this.clickQueryStringTrackedItem({ correlationVariablesIds: [ parseInt(v)] }) } />
            </div>
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
    setPersistedQueryString,
    conditionals
  };
}

export default connect(mapStateToProps, {
  fetchFieldPropertiesIfNeeded,
  selectConditional,
  updateQueryString,
  setPersistedQueryString,
  push
})(CorrelationSidebar);
