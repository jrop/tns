import perplex from 'perplex'

const keysToStrings = obj =>
	Object.keys(obj).map(k => `${k}=${obj[k] && typeof obj[k].toString == 'function' ? obj[k].toString() : obj[k]}`)

class _Connections {
	toString() {
		return keysToStrings(this).join('\n')
	}
}
class _Object {
	toString() {
		return keysToStrings(this).map(part => `(${part})`).join('')
	}
}

function parseConnection(lex) {
	const name = lex.expect('WORD').match
	lex.expect('=')
	const desc = parseObject(lex)
	return {name, desc}
}

function parseObject(lex) {
	lex.expect('(')
	const id = lex.expect('WORD').match
	lex.expect('=')

	let value
	if (lex.peek().type == '(') {
		// read properties
		value = {}
		Object.setPrototypeOf(value, _Object.prototype)
		do {
			Object.assign(value, parseObject(lex))
		} while (lex.peek().type == '(')
	} else
		// simple value:
		value = lex.expect('WORD').match

	lex.expect(')')
	const result = {[id]: value}
	Object.setPrototypeOf(result, _Object.prototype)
	return result
}

export default function parse(s) {
	const lex = perplex(s)
		.token('$SKIP_COMMENT', /#[^\n]*/)
		.token('$SKIP_WS', /\s+/)
		.token('WORD', /[a-z0-9\._-]+/i)
		.token('(', /\(/)
		.token(')', /\)/)
		.token('=', /=/)

	const connections = {}
	while (lex.peek().type != '$EOF') {
		const conn = parseConnection(lex)
		connections[conn.name] = conn.desc
	}
	Object.setPrototypeOf(connections, _Connections.prototype)
	return connections
}
