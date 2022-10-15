const $pageScript = document.createElement('script')
$pageScript.src = chrome.runtime.getURL('dist/page.js')
const $downBtnScript = document.createElement('script')
$downBtnScript.src = chrome.runtime.getURL(
	location.href.match(/^[\w]+:\/\/mobile\.twitter\.com\//)
		? 'dist/m-down-btn.js'
		: 'dist/down-btn.js'
)
;(document.head ?? document.documentElement).append($downBtnScript, $pageScript)

window.addEventListener('message', async (evt: MessageEvent<Msg>) => {
	const { data: msg } = evt
	if (msg.type === 'get-format') {
		chrome.runtime.sendMessage(msg)
			.then(format => {
				window.postMessage({
					type: 'format',
					value: format,
				})
			})
	}
})
