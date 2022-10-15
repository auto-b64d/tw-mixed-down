chrome.runtime.onConnect.addListener(port => {
	if (port.name !== 'heart') return
	port.onMessage.addListener(msg => {
		if (msg.type === 'heartbeat') {
			port.postMessage({ type: 'heartbeat-response' })
		}
	})
})

chrome.runtime.onMessage.addListener((msg: Msg, _, sendResponse) => {
	if (msg.type === 'get-format') {
		chrome.storage.local.get('format')
			.then(({format}) => sendResponse(format))
		return true
	}
})
