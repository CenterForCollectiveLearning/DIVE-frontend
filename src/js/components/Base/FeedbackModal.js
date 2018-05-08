import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateProject, deleteProject } from '../../actions/ProjectActions.js';
import { submitFeedback, closeFeedbackModal } from '../../actions/FeedbackActions.js';
import styles from '../App/App.sass';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

import DropDownMenu from './DropDownMenu';
import BlockingModal from './BlockingModal';
import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class FeedbackModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedbackType: 'feature',
      description: ''
    };
  }

  submit = () => {
    const { project, user, closeAction, submitFeedback, location, isOpen } = this.props;
    const { pathname, search } = location;
    const { feedbackType, description } = this.state;

    const fullPath = pathname + search;

    submitFeedback(
      project.id,
      user.id,
      user.email,
      user.username,
      feedbackType,
      description,
      fullPath
    );
  }

  selectFeedbackType = (feedbackType) => {
    this.setState({ feedbackType: feedbackType });
  }

  enteredFeedbackDescription = (event) => {
    this.setState({ description: event.target.value });
  }
    // Or contact us directly: <a href="mailto:dive@media.mit.edu?Subject=DIVE%20Feedback" target="_top">dive@media.mit.edu</a>
  render() {
    const { closeAction, feedback, isOpen } = this.props;
    const { feedbackType, description } = this.state;

    var footer = feedback.received ? null :
      <div className={ styles.footerContent }>
        <div className={ styles.rightActions }>
          <Button
            intent={ Intent.PRIMARY }
            onClick={ this.submit }
            text="Submit"
          />
        </div>
      </div>;

    return (
      <Dialog
        className={ styles.feedbackModal }
        onClose={ this.props.closeAction }
        title={ feedback.received ? "Thank you for your feedback!" : "Help Us Improve DIVE" }
        isOpen={ isOpen }
      >
        <div className={ Classes.DIALOG_BODY }>
          { feedback.received &&
            <div className={ styles.receivedFeedbackContainer } onClick={ this.props.closeAction }>
              <span className="pt-icon-standard pt-icon-thumbs-up" />
            </div>
          }
          { !feedback.received &&
            <div>
              <div className={ styles.controlSection }>
                <div className={ styles.label }>Category</div>
                <DropDownMenu
                  value={ feedbackType }
                  options={[
                    { id: 'bug', name: 'Bug'},
                    { id: 'feature', name: 'Feature Request'},
                    { id: 'idea', name: 'Idea'},
                    { id: 'complaint', name: 'Complaint'},
                    { id: 'compliment', name: 'Compliment'},
                  ]}
                  valueMember="id"
                  displayTextMember="name"
                  onChange={ this.selectFeedbackType }/>
              </div>
              <div className={ styles.controlSection }>
                <div className={ styles.label }>Description</div>
                <TextArea
                  type="textarea"
                  placeholder={ description }
                  value={ description }
                  onChange={ this.enteredFeedbackDescription }/>
              </div>
            </div>
          }
        </div>
        <div className={ Classes.DIALOG_FOOTER }>
          { footer }
        </div>
      </Dialog>
    );
  }
}

FeedbackModal.propTypes = {
  closeAction: PropTypes.func,
  user: PropTypes.object,
  project: PropTypes.object,
  feedback: PropTypes.object,
  location: PropTypes.object,
  isOpen: PropTypes.bool
};

FeedbackModal.defaultProps = {
  isOpen: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { updateProject, deleteProject, submitFeedback })(FeedbackModal);
