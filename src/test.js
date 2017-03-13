import assert from 'assert'
import parse from './index'

assert.deepEqual(parse(`
SOME_DB.CONN = (DESCRIPTION =
	(PROP1 = 1)
	(PROP2 = 2)
	(OBJ = (PROP3 = 3)))
OTHER = (SHALLOW = true)
`), {
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

// eslint-disable-next-line no-console
console.log('All tests passed')
