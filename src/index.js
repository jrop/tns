import perplex from 'perplex'

export default function parse(s) {
	const lex = perplex(s)
		.token('$SKIP_COMMENT', /#[^\n]*/)
		.token('$SKIP_WS', /\s+/)
		.token('WORD', /[a-z0-9\._]+/i)
		.token('(', /\(/)
		.token(')', /\)/)
		.token('=', /=/)

	const connections = {}
	while (lex.peek().type != '$EOF') {
		const conn = connection()
		connections[conn.name] = conn.desc
	}
	return connections

	function connection() {
		const name = lex.expect('WORD').match
		lex.expect('=')
		const desc = object()
		return {name, desc}
	}

	function object() {
		lex.expect('(')
		const id = lex.expect('WORD').match
		lex.expect('=')

		let value
		if (lex.peek().type == '(') {
			// read properties
			value = {}
			do {
				Object.assign(value, object())
			} while (lex.peek().type == '(')
		} else
			// simple value:
			value = lex.expect('WORD').match

		lex.expect(')')
		return {[id]: value}
	}
}
