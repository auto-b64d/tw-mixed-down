type HE = HTMLElement

interface Msgs {
	'get-format': never
	format: string
}
type MsgType = keyof Msgs
type Msg<Type extends MsgType = MsgType> =
	Type extends any
		? {
			type: Type
			value: Msgs[Type]
		}
		: never
