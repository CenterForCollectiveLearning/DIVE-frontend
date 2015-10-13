import React, { Component, PropTypes } from 'react';

import styles from './visualizations.sass';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';

require('plottable');

class InnerPlottable extends Component {
  componentDidMount() {
    this.renderChart(this.props);
  }

  renderTooLargeText(selector, visualizationDataLength) {
    var svg = d3.select(selector)
      .attr("width", "100%")
      .attr("height", "100%");
    var svgWidth = parseInt(svg.style("width"), 10);
    var svgHeight = parseInt(svg.style("height"), 10);

    var textGroup = svg.append("g")
        .attr("transform", "translate(" + (svgWidth / 2) + ",20)");

    var text = textGroup.append("text")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Too large to preview:");

    var vizLength = textGroup.append("text")
        .attr("font-size", "70px")
        .attr("fill", "#5279c7")
        .attr("text-anchor", "middle")
        .attr("y", 70)
        .text(visualizationDataLength);

    var elements = textGroup.append("text")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("y", 100)
        .text("Data Points");
  }

  renderChart(props) {
    console.log("Rendering chart");
    const { vizTypes, generatingProcedure, id, args } = props.spec;
    const vizType = vizTypes[0];
    const isMinimalView = props.isMinimalView;

    const visualizationData = props.data;
    console.log("Visualization data size:", visualizationData.length);

    const selector = `.spec-${ id }`;

    // Clear Selector
    d3.select(selector).selectAll("*").remove();

    const maxElements = 300;
    const visualizationDataLength = visualizationData.length;

    if (visualizationDataLength > maxElements) {
      this.renderTooLargeText(selector, visualizationDataLength);
      return;
    }

    var plot, dataset, xScale, yScale, xAxis, yAxis, xLabel, yLabel, xAccessor, yAccessor;

    if (vizType == "pie" || vizType == "tree") {
      var scale = new Plottable.Scales.Linear();

      var colorScale = new Plottable.Scales.InterpolatedColor();
      colorScale.range(["#BDCEF0", "#5279C7"]);

      var itemAccessor, valueAccessor;

      if(generatingProcedure == "val:count") {
        itemAccessor = 'value';
        valueAccessor = 'count';
      }
      if(generatingProcedure == "val:agg") {
        itemAccessor = 'value';
        valueAccessor = 'agg';
      }

      var valKeyCollection = [];
      visualizationData.forEach(function (d, i, dataset) {
        var newObj = {};

        var value = d[valueAccessor];
        newObj[valueAccessor] = value;
        valKeyCollection.push(newObj);
      });

      dataset = new Plottable.Dataset(valKeyCollection);
      plot = new Plottable.Plots.Pie();

      plot.addDataset(dataset)
        .sectorValue((d) => d[valueAccessor], scale)
        .attr('fill', (d) => d[valueAccessor], colorScale)
        .labelsEnabled(true)
        .renderTo(selector);

    } else if (vizType == "bar" || vizType == "hist") {

      if (generatingProcedure == 'val:count') {
        xAccessor = 'value';
        yAccessor = 'count';
        xLabel = args.fieldA.name;
        yLabel = 'count';
      } else if (generatingProcedure == 'bin:agg') {
        xAccessor = 'bin';
        yAccessor = 'value';
        xLabel = args.binningField.name;
        yLabel = args.aggFieldA.name;
      } if (generatingProcedure == 'val:val') {
        xAccessor = 'x';
        yAccessor = 'y';
        xLabel = args.fieldA.name;
        yLabel = args.fieldB.name;
      } if (generatingProcedure == 'val:agg') {
        xAccessor = 'value';
        yAccessor = 'agg';
        xLabel = args.groupedField.name;
        yLabel = args.aggField.name;
      }

      plot = new Plottable.Plots.Bar();

      const xDomain = visualizationData.map((d) => d[xAccessor]);
      xScale = new Plottable.Scales.Category().domain(xDomain);
      yScale = new Plottable.Scales.Linear();

      xAxis = new Plottable.Axes.Category(xScale, "bottom");
      yAxis = new Plottable.Axes.Numeric(yScale, "left");

      xLabel = new Plottable.Components.AxisLabel(xLabel);
      yLabel = new Plottable.Components.AxisLabel(yLabel, -90);

      dataset = new Plottable.Dataset(visualizationData);

      plot.addDataset(dataset)
        .x((d) => d[xAccessor], xScale)
        .y((d) => d[yAccessor], yScale)

      plot.animated(false);
      plot.renderTo(selector);

      if (isMinimalView) {
        plot.animated(false);
        plot.renderTo(selector);
      } else {
        plot.animated(true);
        var chart = new Plottable.Components.Table([
          [yLabel, yAxis, plot],
          [null, null, xAxis],
          [null, null, xLabel]
        ]);
        chart.renderTo(selector);
      }

    } else if (vizType == "lines") {
      if (generatingProcedure == 'ind:val') {
        xAccessor = 'index';
        yAccessor = 'value';
        xLabel = 'index';
        yLabel = args.fieldA.label;
      }

      plot = new Plottable.Plots.Line();

      xScale = new Plottable.Scales.Linear();
      yScale = new Plottable.Scales.Linear();

      xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
      yAxis = new Plottable.Axes.Numeric(yScale, "left");

      xLabel = new Plottable.Components.AxisLabel(xLabel);
      yLabel = new Plottable.Components.AxisLabel(yLabel, -90);

      dataset = new Plottable.Dataset(visualizationData);

      plot.addDataset(dataset)
        .x((d) => d[xAccessor], xScale)
        .y((d) => d[yAccessor], yScale);

      plot.animated(false);
      plot.renderTo(selector);
    }

    window.addEventListener("resize", function() {
      plot.redraw();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.spec.id != nextProps.spec.id) {
      this.renderChart(nextProps);
    }
  }

  render() {
    return (
      <div>
        {/** this.props.spec.vizTypes **/}
      </div>
    );
  }
}

InnerPlottable.propTypes = {
  spec: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  isMinimalView: PropTypes.bool.isRequired
};

export default class Visualization extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { onClick, spec } = this.props;

    if (onClick) {
      onClick(spec.id);
    }
  }

  render() {
    const { data, spec, containerClassName, showHeader, headerClassName, visualizationClassName, isMinimalView } = this.props;
    return (
      <div className={ styles[containerClassName] } onClick={ this.handleClick }>
        { showHeader && spec.meta &&
          <div className={ styles[headerClassName] }>
            { spec.meta.construction.map((construct, i) =>
              <span key={ `construct-${ construct.type }-${ i }` } className={ `${styles.headerFragment} ${styles[construct.type]}` }>{ construct.string } </span>
            )}
          </div>
        }
        <div className={ styles[visualizationClassName] }>
          <svg className={ `spec-${spec.id}` }></svg>
          <InnerPlottable spec={ spec } data={ data } isMinimalView={ isMinimalView } />
        </div>
      </div>
    );
  }
}

Visualization.propTypes = {
  spec: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  visualizationClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  isMinimalView: PropTypes.bool,
  onClick: PropTypes.func,
  showHeader: PropTypes.bool
};

Visualization.defaultProps = {
  visualizationClassName: "visualization",
  containerClassName: "block",
  headerClassName: "header",
  isMinimalView: false,
  showHeader: false
};
