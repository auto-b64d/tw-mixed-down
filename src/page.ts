// https://github.com/mstfsnc/twitter-video-downloader-extension

const onCapturedRequest = (callback: (x: any) => void) => {
	const { open } = XMLHttpRequest.prototype
	XMLHttpRequest.prototype.open = function(this: XMLHttpRequest, ...args: Array<any>) {
		const requestUrl = args[1]
		if (/twitter\.com\/i\/api\/(2|graphql|1\.1)\//i.test(requestUrl)) {
			const { send } = this
			this.send = function(...args) {
				const { onreadystatechange } = this
				this.onreadystatechange = function(...args) {
					const { readyState, responseText: resText } = this
					if (readyState === XMLHttpRequest.DONE && resText) {
						try {
							callback(JSON.parse(resText))
						} catch (e) {
							console.error(e)
						}
					}
					return onreadystatechange!.apply(this, args)
				}
				return send.apply(this, args)
			}
		}
		return open.apply(this, args as any)
	} as any
}

interface Els {
	$el: HTMLImageElement
	$actionList: HE
}
const observeTweets = (callback: (els: Els) => void) => {
	if (document.readyState !== 'loading') {
		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const $el of mutation.addedNodes) {
					if (!($el instanceof HTMLImageElement)) continue
					const $container = $el.closest('article')
					if ($container === null) continue
					const $actionList = $container.querySelector('[role=group]:last-child')
					if (!($actionList instanceof HTMLElement)) continue
					callback({ $el, $actionList })
				}
			}
		})
		observer.observe(document.getElementById('react-root')!, { childList: true, subtree: true })
	} else document.addEventListener('DOMContentLoaded', () => observeTweets(callback))
}

const findContainingKey = (key: string) =>
	(from: any): Array<any> => {
		if (from === null || typeof from !== 'object') return []
		if (from[key] !== undefined) return [from]
		return Object.values(from)
			.flatMap(findContainingKey(key))
	}

const parse = (res: any) =>
	findContainingKey('extended_entities')(res)
		.map(x => ({
			id: x.id_str as string,
			videos: (x.extended_entities.media as Array<any>)
				.filter(media => media.type === 'video')
				.map(video => {
					const bestVariant = video.video_info.variants
						.filter(variant => variant.content_type === 'video/mp4')
						.sort((a, b) => b.bitrate - a.bitrate)
						[0]
					return {
						id: video.id_str as string,
						url: bestVariant.url as string,
					}
				})
		}))
		.filter(x => x.videos.length !== 0)

const bulkDownload = async (
	urls: Array<string>,
	format: string | null,
	formatArgs: Record<'id' | 'name' | 'now', string>
) => {
	const $dummyA = document.createElement('a')
	$dummyA.style.display = 'none'
	$dummyA.setAttribute('target', '_blank')
	document.body.append($dummyA)
	let n = 0
	for (const url of urls) {
		const stringifiedN = n.toString()
		const stringifiedUrlCountLength = urls.length.toString().length
		const filename = (format ?? '[now].mp4')
			.replace(/\[id\]/g, formatArgs.id)
			.replace(/\[name\]/, formatArgs.name)
			.replace(/\[now\]/g, formatArgs.now)
			.replace(/\[n\]/g, stringifiedN.padStart(stringifiedUrlCountLength - stringifiedN.length, '0'))
		await fetch(url)
			.then(res => res.blob())
			.then(res => {
				$dummyA.href = URL.createObjectURL(res)
				$dummyA.setAttribute('download', filename)
				$dummyA.click()
				URL.revokeObjectURL($dummyA.href)
			})
		n++
	}
	$dummyA.remove()
}

const tweets: Array<any> = []
onCapturedRequest(res => tweets.push(...parse(res)))

const extractIdFrom = (url: string | null) => url?.match(/(?<=\w+\/)\d+(?=\/pu)/)?.[0]

const serializeUserName = ($username: HTMLElement) =>
	[...$username.children]
		.reduce((name, $el) =>
			name + ($el instanceof HTMLImageElement
				? $el.alt
				: $el.innerHTML
			),
			''
		)

observeTweets(({ $el, $actionList }) => {
	if ($actionList.querySelector('[tw-mixed-down]') !== null) return
	const $tweet = $el.closest('article')!
	const $downloadBtn = downloadBtn($actionList)
	$actionList.append($downloadBtn)
	$downloadBtn.addEventListener('click', async () => {
		const $id = $tweet.querySelector<HTMLSpanElement>('a > div > span')!
		const id = $id.innerText.slice(1)
		const $dateA = $id.closest('a')!.parentElement!.nextElementSibling!.nextElementSibling!.firstElementChild!
		const tweet = tweets.find(tweet => tweet.id === $dateA.getAttribute('href')!.match(/\d+$/)![0])!
		const name = serializeUserName($tweet.querySelector('span')!)
		const now = new Date()
		const [year, month, date, hour, minute, second] = [
			now.getFullYear(),
			now.getMonth() + 1,
			now.getDate(),
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
		].map(x => x.toString().padStart(2, '0'))
		window.postMessage({ type: 'get-format' })
		
		window.addEventListener('message', async (evt: MessageEvent<Msg>) => {
			const { data: msg } = evt
			if (msg.type === 'format') {
				const format = msg.value
				const now = `${year}${month}${date}${hour}${minute}${second}`
				const urls = tweet.videos.map(video => video.url)
				bulkDownload(urls, format, { id, name, now })
			}
		}, { once: true })
	})
})
