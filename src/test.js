import assert from 'assert'
import parse from './index'

const parsed = parse(`
SOME_DB.CONN = (DESCRIPTION =
	(PROP1 = 1)
	(PROP2 = 2)
	(OBJ = (PROP3 = 3)))
OTHER = (SHALLOW = true)
`)

const parsedWithoutToString = Object.assign({}, parsed) // shallow copy
Object.keys(parsedWithoutToString)
	.forEach(conn => {
		parsedWithoutToString[conn] = Object.assign({}, parsedWithoutToString[conn]) // shallow copy
		delete parsedWithoutToString[conn].toString
	})
assert.deepEqual(parsedWithoutToString, {
	'SOME_DB.CONN': {
		DESCRIPTION: {
			PROP1: 1,
			PROP2: 2,
			OBJ: {PROP3: 3},
		},
	},
	'OTHER': {
		SHALLOW: 'true',
	},
})

assert.equal(parsed['SOME_DB.CONN'].toString(), `
(DESCRIPTION =
	(PROP1 = 1)
	(PROP2 = 2)
	(OBJ = (PROP3 = 3)))
`.replace(/\s+/g, ''))

// eslint-disable-next-line no-console
console.log('All tests passed')
