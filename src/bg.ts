chrome.runtime.onMessage.addListener(async (msg: Msg, _, sendResponse) => {
	if (msg.type === 'download') {
		const { id, name, now, urls } = msg.value
		const { format } = await chrome.storage.local.get('format') as { format: string }
		const filename = (format ?? '[now].mp4')
			.replace(/\[id\]/g, id)
			.replace(/\[name\]/, name)
			.replace(/\[now\]/g, now)
		let n = 0
		for (const url of urls) {
			const stringifiedN = n.toString()
			const stringifiedUrlCountLength = urls.length.toString().length
			await chrome.downloads.download({
				url,
				filename: filename.replace(/\[\]/g, stringifiedN.padStart(stringifiedUrlCountLength - stringifiedN.length, '0')),
				conflictAction: 'uniquify',
			})
			n++
		}
		sendResponse()
	}
})
