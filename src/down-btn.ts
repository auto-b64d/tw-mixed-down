// @ts-ignore
const downloadBtn = ($actionList: HE) => {
	const $shareBtn = $actionList.children[3] as HE
	const $downloadBtn = $shareBtn.cloneNode(true) as HE
	$downloadBtn.setAttribute('tw-mixed-down', '')
	const $arrowPath = $downloadBtn.querySelector('svg')!.children[0].children[0] as SVGPathElement
	$arrowPath.style.transformBox = 'fill-box'
	$arrowPath.style.transformOrigin = 'center'
	$arrowPath.setAttribute('transform', 'rotate(180)')
	return $downloadBtn
}
