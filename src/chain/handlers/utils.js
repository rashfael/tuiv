
module.exports.handleExistAssertWithPlaywright = async function (elementOrFrame, op, index, {block, assertion}) {
	// use playwright to check for non-existing element by using state: 'hidden'
	// fill assertion.subject directly and generate message in matcher
	if (op.get === 'waitForSelector'
		&& op.apply
		&& assertion?.verb === 'exist'
		&& block.ops.length - 1 === index // only if last before assertion
	) {
		let existence = false
		if (assertion.not) {
			// should not exist
			try {
				await elementOrFrame.waitForSelector(op.apply[0], Object.assign({timeout: 5000}, op.apply[1], {state: 'hidden'}))
			} catch (error) {
				if (error.name !== 'TimeoutError') throw error
				existence = true
			}
		} else {
			// should exist
			try {
				await elementOrFrame.waitForSelector(op.apply[0], op.apply[1])
				existence = true
			} catch (error) {
				if (error.name !== 'TimeoutError') throw error
			}
		}
		assertion.subject = {
			name: 'existence',
			data: existence
		}
		return true // return, there should be nothing else in the chain
	}
}
