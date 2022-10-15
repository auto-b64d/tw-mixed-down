// @ts-ignore
const downloadBtn = ($actionList: HE) => {
	const $shareBtn = $actionList.children[3] as HE
	const $downloadBtn = $shareBtn.cloneNode(true) as HE
	$downloadBtn.setAttribute('tw-mixed-down', '')
	$downloadBtn.querySelector('svg')!.innerHTML = '<g><path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z" transform="rotate(180)" style="transform-box: fill-box; transform-origin: center center;"></path><path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path></g>'
	const $arrowPath = $downloadBtn.querySelector('svg')!.children[0].children[0] as SVGPathElement
	$arrowPath.style.transformBox = 'fill-box'
	$arrowPath.style.transformOrigin = 'center'
	$arrowPath.setAttribute('transform', 'rotate(180)')
	return $downloadBtn
}
