import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Intent, NonIdealState } from '@blueprintjs/core';

import styles from './ErrorComponent.sass';

export default class ErrorComponent extends Component {
	render() {
		const { title, description, action, visual } = this.props;

		return (
			<div className={ styles.centeredFill }>
	      <NonIdealState
	        title={ title }
	        description={ description }
	        visual='error'
	        action={ <div className={ styles.errorAction }>
	          <div>Please change your selection or</div>
	          <Button
	            onClick={ () => location.reload() }
	            iconName='refresh'
	            intent={ Intent.PRIMARY }
	            text="Refresh DIVE" />
	          </div>
	        }
	      />
	    </div>
    );
	}
}

ErrorComponent.propTypes = {
	title: PropTypes.string,
	action: PropTypes.node,
	visual: PropTypes.string,
	description: PropTypes.string,
}

ErrorComponent.defaultProps = {
	title: 'Error',
	visual: 'error',
	description: ''
}