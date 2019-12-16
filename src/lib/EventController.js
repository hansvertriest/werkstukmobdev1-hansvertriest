class EventController {
	addClickListener(elementId, callback) {
		return document.getElementById(elementId).addEventListener('click', callback);
	}

	removeClickListener(elementId) {
		document.getElementById(elementId).removeEventListener('click');
	}
}
export default new EventController();
