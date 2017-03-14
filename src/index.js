import perplex from 'perplex'

function objectToTnsString(spec) {
	if (typeof spec == 'string') return spec
	const inner = Object.keys(spec)
		.filter(key => typeof spec[key] !== 'function')
		.map(key => `${key}=${objectToTnsString(spec[key])}`)
		.join(')(')
	return `(${inner})`
}

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
		connections[conn.name].toString = conn.toString
	}
	return connections

	function connection() {
		const name = lex.expect('WORD').match
		lex.expect('=')
		const desc = object()
		const conn = {name, desc, toString() {return objectToTnsString(desc)}}
		return conn
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
