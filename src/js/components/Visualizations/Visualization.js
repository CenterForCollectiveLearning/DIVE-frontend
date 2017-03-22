import React, { Component, PropTypes } from 'react';

import styles from './Visualizations.sass';

import { getPalette, useWhiteFontFromBackgroundHex, naturalSort } from '../../helpers/helpers';

import { MAX_ELEMENTS } from './VisualizationOptions';
import TreeMap from './Charts/TreeMap';
import ColorGrid from './Charts/ColorGrid';
import PieChart from './Charts/PieChart';
import ColumnChart from './Charts/ColumnChart';
import StackedColumnChart from './Charts/StackedColumnChart';
import ScatterChart from './Charts/ScatterChart';
import LineChart from './Charts/LineChart';
import Histogram from './Charts/Histogram';
import BoxPlot from './Charts/BoxPlot';

export default class Visualization extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.forceUpdate();
  }

  handleClick = (event) => {
    const { onClick, spec } = this.props;

    if (onClick) {
      onClick(spec.id);
    }
  }

  render() {
    const { data, bins, spec, fieldNameToColor, containerClassName, showHeader, headerClassName, visualizationClassName, overflowTextClassName, isMinimalView, visualizationTypes, sortOrders, sortFields, config, isCard, subset } = this.props;
    const { args, meta } = spec;
    const chartId = `${ this.props.chartId || spec.id }${ ( sortIndex ? '-' + sortIndex : '') }`;
    const validVisualizationTypes = spec.vizTypes.filter((vizType) => visualizationTypes.length == 0 || visualizationTypes.indexOf(vizType) >= 0);
    const defaultVisualizationType = validVisualizationTypes[0];

    var labels = {};
    if (defaultVisualizationType == 'grid') {
      if ('fieldA' in spec.args) {
        labels = {
          x: spec.args.fieldA.name,
          y: spec.args.fieldB.name,
        }
      }
      if ('groupedFieldA' in spec.args) {
        labels = {
          x: spec.args.groupedFieldA.name,
          y: spec.args.groupedFieldB.name,
        }
      }
    } else {
      if (meta.labels) {
        labels = meta.labels;
      }
    }

    // Mutating options
    var colors = [];
    var primaryVariableKeys = [ 'aggField', 'aggFieldA', 'boxedField', 'binningField', 'fieldA', 'fieldB' ];
    for (var i in primaryVariableKeys) {
      var primaryVariableKey = primaryVariableKeys[i];
      if (primaryVariableKey in args) {
        var fieldName = args[primaryVariableKey].name;
        if (fieldName in fieldNameToColor) {
          colors.push(fieldNameToColor[fieldName]);
        }
      }
    }
    colors = colors.length != 0 ? colors : [ '#007BD7' ];

    // Sorting fields
    var finalDataArray = data;
    let sortIndex;
    if (sortFields.length && sortOrders.length) {
      var sortField, sortOrder;

      sortFields.forEach(function(s) {
        if (s.selected)
          sortField = s.id;
      });
      sortOrders.forEach(function(s) {
        if (s.selected)
          sortOrder = s.id;
      });
      sortIndex = (sortOrder == 'asc') ? 1 : -1;

      const header = data[0];
      const dataPoints = data.slice(1);
      const sortedDataPoints = dataPoints.sort((a, b) => {
        var aValue = a[sortField];
        if (Array.isArray(aValue)) {
          aValue = (aValue[0] + aValue[1]) / 2
        }
        var bValue = b[sortField];
        if (Array.isArray(bValue)) {
          bValue = (bValue[0] + bValue[1]) / 2
        }
        return sortIndex * naturalSort(aValue, bValue);
      });

      finalDataArray = [ header, ...sortedDataPoints ];
    }

    // Handle max elements

    const tooMuchDataToPreview =
      (isMinimalView &&
        (data.length > MAX_ELEMENTS.preview.all ||
          (defaultVisualizationType == 'tree' && data.length > MAX_ELEMENTS.preview.treemap)
        )
      );
    const tooMuchDataToShowFull =
      (!isMinimalView &&
        (data.length > MAX_ELEMENTS.full.all ||
          (defaultVisualizationType == 'tree' && data.length > MAX_ELEMENTS.full.treemap)
        )
      );

    var tooMuchDataString = '';
    if (tooMuchDataToPreview || tooMuchDataToShowFull) {
      tooMuchDataString = 'Top 20';
      finalDataArray = data.slice(0, 20);
    }

    const noData = finalDataArray.length == 1;
    if (noData) {
      return (
        <div className={ styles.watermark + (isMinimalView ? styles.watermarkNoSpacer : '') }>
          No visualization.
        </div>
      );
    }

    return (
      <div className={ ( isCard ? 'pt-card pt-interactive ' : '' )+ containerClassName } onClick={ this.handleClick }>
        { showHeader && spec.meta &&
          <div className={ headerClassName }>
            { spec.meta.construction.map(function(construct, i) {
              var style = {};
              var whiteFont = true;
              if (construct.type == 'field') {
                var backgroundColor = fieldNameToColor[construct.string];
                whiteFont = useWhiteFontFromBackgroundHex(backgroundColor);
                style['backgroundColor'] = backgroundColor;
              }

              return <span
                style={ style }
                key={ `construct-${ construct.type }-${ i }` }
                className={
                  `${styles.headerFragment} ${styles[construct.type]}`
                  + ' ' + ( whiteFont ? styles.whiteFont : styles.blackFont )
              }>{ construct.string }</span>
            })}
            { (tooMuchDataToPreview || tooMuchDataToShowFull) &&
              <span className={ `${styles.headerFragment} ${styles.tooMuchData}` }>
                ({ tooMuchDataString })
              </span>
            }
          </div>
        }
        <div className={ styles.visualization
            + ' ' + styles[defaultVisualizationType]
            + (isMinimalView ? ' ' + styles.minimal : '')
            + (visualizationClassName ? ' ' + visualizationClassName : '')
          }>
            { subset && subset != 'all' &&
              <div className={ styles.subsetMarker }>SUBSET ({ subset })</div>
            }
            { (defaultVisualizationType == 'box') &&
              <BoxPlot
                chartId={ `spec-box-${ chartId }` }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
            { (defaultVisualizationType == 'hist') &&
              <Histogram
                chartId={ `spec-hist-${ chartId }` }
                data={ finalDataArray }
                bins={ bins }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
            { (defaultVisualizationType == 'bar') &&
              <ColumnChart
                chartId={ `spec-bar-${ chartId }` }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
            { (defaultVisualizationType == 'stackedbar' ) &&
              <StackedColumnChart
                chartId={ `spec-stackedbar-${ chartId }` }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
            { (defaultVisualizationType == 'grid' ) &&
              <ColorGrid
                chartId={ `spec-stackedbar-${ chartId }` }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
            { (defaultVisualizationType == 'scatter' ) &&
              <ScatterChart
                chartId={ `spec-bar-${ chartId }` }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
            { (defaultVisualizationType == 'line' ) &&
              <LineChart
                chartId={ `spec-line-${ chartId }` }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config={ config }/>
            }
            { defaultVisualizationType == 'pie' &&
              <PieChart
                chartId={ `spec-pie-${ chartId }` }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
            { defaultVisualizationType == 'tree' &&
              <TreeMap
                chartId={ `spec-tree-${ chartId }` }
                parent={ spec.meta.desc }
                data={ finalDataArray }
                colors={ colors }
                labels={ labels }
                isMinimalView={ isMinimalView }
                config = { config }/>
            }
          </div>
      </div>
    );
  }
}

Visualization.propTypes = {
  chartId: PropTypes.string,
  spec: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  visualizationClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  overflowTextClassName: PropTypes.string,
  isMinimalView: PropTypes.bool,
  onClick: PropTypes.func,
  showHeader: PropTypes.bool,
  visualizationTypes: PropTypes.array,
  bins: PropTypes.array,
  sortOrders: PropTypes.array,
  sortFields: PropTypes.array,
  config: PropTypes.object,
  isCard: PropTypes.bool,
  subset: PropTypes.any
};

Visualization.defaultProps = {
  chartId: null,
  visualizationClassName: null,
  containerClassName: styles.visualizationBlock,
  headerClassName: styles.header,
  overflowTextClassName: styles.overflowText,
  isMinimalView: false,
  showHeader: false,
  visualizationTypes: [],
  sortOrders: [],
  sortFields: [],
  fieldNameToColor: {},
  config: {},
  isCard: false,
  subset: false
};
