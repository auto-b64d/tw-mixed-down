chrome.runtime.onMessage.addListener((msg: Msg, _, sendResponse) => {
	if (msg.type === 'get-format') {
		chrome.storage.local.get('format')
			.then(({format}) => sendResponse(format))
		return true
	}
})
