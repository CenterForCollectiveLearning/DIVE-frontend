import React, { Component, PropTypes } from 'react';
import _ from 'underscore';

import styles from './Datasets.sass';

export default class DatasetRow extends Component {
  render() {
    const { data } = this.props;
    const { items, rowType } = data;

    const Row = React.createClass({
      getDefaultProps: function() {
        return { className: '' };
      },
      render: function() {
        return (
          <div className={ styles.row + ' ' + this.props.className }>{ this.props.children }</div>
        );
      }
    });

    const Cell = React.createClass({
      getDefaultProps: function() {
        return { className: '', title: null };
      },
      render: function() {
        return (
          <div title={ this.props.title } className={ styles.cell + ' ' + this.props.className }>{ this.props.children }</div>
        );
      }
    });

    // if (type == 'tableHeader') {
    //   return (
    //     <Row className={ styles.headerRow }>
    //       <Column className={ styles.headerColumn }>
    //         <Cell>Variables</Cell>
    //       </Column>
    //       { _.range(data.size).map((i) =>
    //           <Column key={`header-${ i }`} className={ styles.headerColumn }>
    //             <Cell>({ i + 1 })</Cell>
    //           </Column>
    //         )
    //       }
    //     </Row>
    //   );
    // }

    return (
      <Row className={ styles.row + ' ' + styles[rowType] }>
        { items && items.map((column, i) =>
          <Cell className={ styles.cell + ' ' + styles[column.type] }>
            { column.value }
          </Cell>
        )}
      </Row>
    );
  }
}

DatasetRow.propTypes = {
  data: PropTypes.object.isRequired
}

DatasetRow.defaultProps = {
  data: {}
}
