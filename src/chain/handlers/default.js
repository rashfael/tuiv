// default handler just uses Reflect to get and apply ops

module.exports = function (target, op) {
	const thisArg = target
	if (op.get) {
		
		if (target === undefined || target === null) {
			throw new Error('target is null or undefined')
		}
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
