chrome.runtime.onMessage.addListener(async (msg: Msg, _, sendResponse) => {
	if (msg.type === 'get-format') {
		const { format } = await chrome.storage.local.get('format')
		sendResponse(format)
	}
})
