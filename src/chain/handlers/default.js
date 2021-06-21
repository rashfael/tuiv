// default handler just uses Reflect to get and apply ops

module.exports = function (target, op, index) {
	const thisArg = target
	if (op.get) {
		if (!Reflect.has(target, op.get)) {
			throw new Error(`target has no attribute "${op.get}"`)
		}
		target = Reflect.get(target, op.get, thisArg)
	}
	if (op.apply) {
		target = Reflect.apply(target, thisArg, op.apply)
	}
	return target
}
