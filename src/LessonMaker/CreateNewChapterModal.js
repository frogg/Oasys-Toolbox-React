import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { InputGroup, InputGroupAddon, Input, InputGroupText, InputGroupButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Button } from 'reactstrap';

class CreateNewChapterModal extends Component {

	state = {
		newCategoryName: ""
	}

	onCreateNewChapter() {
		this.props.onCreateNewChapter(this.state.newCategoryName);
		this.props.onClose();
		this.setState({
			newCategoryName: ""
		});
	}

	toggle() {
		this.props.onClose();
	}

	onChangeText(element) {
		this.setState({
			newCategoryName: element.target.value
		});
	}

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.toggle.bind(this)} backdrop={true}>
	          <ModalHeader toggle={this.toggle.bind(this)}>Thank you for deciding to create a new chapter.</ModalHeader>
	          <ModalBody>
	          	<InputGroup>
                    <Input placeholder="new name of the kategor" value={this.state.newCategoryName} onChange={this.onChangeText.bind(this)} />
                </InputGroup>
	          </ModalBody>
	          <ModalFooter>
	            <Button color="primary" onClick={this.onCreateNewChapter.bind(this)}>Create new Chapter</Button>{' '}
	            <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
	          </ModalFooter>
	        </Modal>
			)
	}
}


export default CreateNewChapterModal;