import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { removeFromQueryString, updateQueryString } from '../../helpers/helpers';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';
import { setPersistedQueryString } from '../../actions/CorrelationActions';
import { selectConditional } from '../../actions/ConditionalsActions';
import styles from './Compose.sass';

import ConditionalSelector from '../Base/ConditionalSelector';
import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import SidebarCategoryGroup from '../Base/SidebarCategoryGroup';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import DropDownMenu from '../Base/DropDownMenu';

import ComposeVisualizationPreviewBlock from './ComposeVisualizationPreviewBlock';
import ComposeRegressionPreviewBlock from './ComposeRegressionPreviewBlock';
import ComposeCorrelationPreviewBlock from './ComposeCorrelationPreviewBlock';
import ComposeAggregationPreviewBlock from './ComposeAggregationPreviewBlock';
import ComposeComparisonPreviewBlock from './ComposeComparisonPreviewBlock';
import { CONTENT_TYPES } from '../../constants/ContentTypes';

export class ComposeSidebar extends Component {

  selectVisualization = (specId, specHeading) => {
    this.props.selectComposeContent(CONTENT_TYPES.VISUALIZATION, specId, specHeading);
  }

  selectAggregation = (specId, specHeading) => {
    this.props.selectComposeContent(CONTENT_TYPES.AGGREGATION, specId, specHeading);
  }

  selectComparison = (specId, specHeading) => {
    this.props.selectComposeContent(CONTENT_TYPES.COMPARISON, specId, specHeading);
  }  

  selectCorrelation = (specId, specHeading) => {
    this.props.selectComposeContent(CONTENT_TYPES.CORRELATION, specId, specHeading);
  }

  selectRegression = (specId, specHeading) => {
    this.props.selectComposeContent(CONTENT_TYPES.REGRESSION, specId, specHeading);
  }

  selectText = () => {
    this.props.selectComposeContent(CONTENT_TYPES.TEXT, null, null);
  }

  render() {
    const { exportedSpecs, exportedAnalyses, fieldNameToColor } = this.props;
    const { aggregation, correlation, regression, comparison } = exportedAnalyses.data;

    return (
      <Sidebar className={ styles.composeSidebar } selectedTab="correlation">
        <SidebarCategoryGroup
          heading={ `Text` }
          iconName="annotation"
        >
          <div
            className={ styles.contentPreviewBlockContainer }
            onClick={ this.selectText }>
            <div className={ styles.textBlock + ' pt-card pt-interactive' }>Text only</div>
          </div>
        </SidebarCategoryGroup>
        { !exportedSpecs.isFetching && exportedSpecs.items.length > 0 &&
          <SidebarCategoryGroup
            heading={ `Visualizations (${ exportedSpecs.items.length })` }
            iconName="timeline-area-chart"
          >
          { exportedSpecs.items.map((spec) =>
            <ComposeVisualizationPreviewBlock onClick={ this.selectVisualization }
              spec={ spec }
              key={ spec.id }
              fieldNameToColor={ fieldNameToColor }
            />
          )}
          </SidebarCategoryGroup>
        }
        { !exportedAnalyses.isFetching && aggregation.length > 0 &&
          <SidebarCategoryGroup
            heading={ `Aggregation (${ aggregation.length})` }
            iconName="th"
          >
            { aggregation.map((spec) =>
              <ComposeAggregationPreviewBlock onClick={ this.selectAggregation } spec={ spec } key={ spec.id }/>
            )}
          </SidebarCategoryGroup>
        }     
        { !exportedAnalyses.isFetching && comparison.length > 0 &&
          <SidebarCategoryGroup
            heading={ `Comparisons (${ comparison.length})` }
            iconName="th"
          >
            { comparison.map((spec) =>
              <ComposeComparisonPreviewBlock onClick={ this.selectComparison } spec={ spec } key={ spec.id }/>
            )}
          </SidebarCategoryGroup>
        }           
        { !exportedAnalyses.isFetching && correlation.length > 0 &&
          <SidebarCategoryGroup
            heading={ `Correlations (${ correlation.length})` }
            iconName="th"
          >
            { correlation.map((spec) =>
              <ComposeCorrelationPreviewBlock onClick={ this.selectCorrelation } spec={ spec } key={ spec.id }/>
            )}
          </SidebarCategoryGroup>
        }
        { !exportedAnalyses.isFetching && regression.length > 0 &&
          <SidebarCategoryGroup
            heading={ `Regressions (${ regression.length })` }
            iconName="th"
          >
            { regression.map((spec) =>
              <ComposeRegressionPreviewBlock onClick={ this.selectRegression } spec={ spec } key={ spec.id }/>
            )}
          </SidebarCategoryGroup>
        }

      </Sidebar>
    );
  }
}

ComposeSidebar.propTypes = {
  exportedSpecs: PropTypes.object,
  exportedAnalyses: PropTypes.object,
  selectComposeContent: PropTypes.func,
  fieldNameToColor: PropTypes.object
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
})(ComposeSidebar);
