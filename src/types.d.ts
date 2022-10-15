type HE = HTMLElement

interface Msgs {
	download: {
		id: string
		name: string
		now: string
		urls: Array<string>
	}
}
type MsgType = keyof Msgs
type Msg<Type extends MsgType = MsgType> = {
	type: Type
	value: Msgs[Type]
}
