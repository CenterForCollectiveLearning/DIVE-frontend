import React from 'react';

export const HELPER_TEXT = {
  regression: 'Simple linear regression is the least squares estimator of a linear regression model with a single explanatory variable. In other words, simple linear regression fits a straight line through the set of n points in such a way that makes the sum of squared residuals of the model (that is, vertical distances between the points of the data set and the fitted line) as small as possible.',
  rsquared: 'Contribution to R-squared by variable.',
  anova: 'Analysis of variance (ANOVA) is a collection of statistical models used to analyze the differences among group means and their associated procedures (such as "variation" among and between groups).',
  pairwiseComparison: 'Tukey\'s HSD test is single-step multiple comparison procedure and statistical test. It can be used on raw data or in conjunction with an ANOVA (Post-hoc analysis) to find means that are significantly different from each other. Named after John Tukey,[2] it compares all possible pairs of means, and is based on a studentized range distribution (q).',
  comparisonBoxplot: 'The box plot (a.k.a. box and whisker diagram) is a standardized way of displaying the distribution of data based on the five number summary: minimum, first quartile, median, third quartile, and maximum.',
  aggregation: 'Aggregating discrete values or bins of selected fields.',
  correlation: 'Table showing pearson correlation between pairs of selected fields.',
  correlationScatterplots: 'Scatterplots showing relationship between pairs of selected fields.',
  exploreSelectedFields: 'Recommended visualizations involving your selected fields.',
  exploreDefault: 'By default, DIVE recommends descriptive visualizations of each column in your dataset. Select a field on your bottom right to receive field-specific recommendations.',
  exactMatches: 'Visualizations involving all selected fields.',
  individualMatches: 'Visualizations involving exactly one selected field.',
  closeMatches: 'Visualizations involving two or more selected fields.',
  expandedMatches: 'Visualizations involving one or more selected fields, in addition to non-selected fields.',
  regressionModel: <div>
    <p>Regression model describes the procedure used to determine.</p>
    <p><b>Forward R<sup>2</sup></b>, also known as stepwise selection, is a greedy forward-selection algorithm incrementally adding the variables that explain the most variance in the model (R<sup>2</sup>) above a certain threshold.</p>
    <p><b>LASSO</b> is a variable selection approach constraining the sum of the absolute value of the regression coefficients beneath a certain threshold.</p>
  </div>,
  tableLayout: <div>
    <p>Table layout describes the other regression models included with the complete model that includes all variables.</p>
    <p><b>One at a time</b> includes models with each independent variable individually.</p>
    <p><b>Leave one out</b> includes models with the complete model excluding one independent variable at a time.</p>
    <p><b>Complete</b> only includes the one model with all variables.</p>
  </div>,
  regressionType: <div>
    <p>Regression type describes the model used to describe the relationship between the dependent variable (y) and the independent variables (x).</p>
    <p>A <b>linear model</b> estimates y as a linear combination of the independent variables.</p>
    <p>A <b>logistic regression</b> estimates probabilities of a categorical dependent variable using a logistic function.</p>
  </div>
}
