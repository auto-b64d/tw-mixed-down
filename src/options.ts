const $format = document.getElementById('format')! as HTMLInputElement
let timeout: ReturnType<typeof setTimeout> | null = null

const requestSaveSoon = () => {
	if (timeout !== null) {
		clearTimeout(timeout)
		timeout = null
	}
	$format.style.removeProperty('border-color')
	timeout = setTimeout(() => {
		chrome.storage.local.set({
			format: $format.value
		})
		$format.style.borderColor = 'limegreen'
	}, 300)
}

$format.addEventListener('input', requestSaveSoon)

chrome.storage.local.get('format')
	.then(({ format }) => {
		$format.value = format ?? ''
	})
