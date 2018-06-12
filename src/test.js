import parse from './index'
import test from 'tape'

test('nested', t => {
	t.deepLooseEqual({
		'SOME_DB.CONN': {
			DESCRIPTION: {
				PROP1: '1',
				PROP2: '2',
				OBJ: {PROP3: '3'}
			}
		},
		OTHER: {SHALLOW: 'true'}
	}, parse(`
		SOME_DB.CONN = (DESCRIPTION =
			(PROP1 = 1)
			(PROP2 = 2)
			(OBJ = (PROP3 = 3)))
		OTHER = (SHALLOW = true)
	`))
	t.end()
})

test('WORDs (dashes)', t => {
	t.deepLooseEqual({
		ABCD: {
			DESCRIPTION: {
				ADDRESS_LIST: {
					ADDRESS: {
						PROTOCOL: 'TCP',
						HOST: 'rac-scan.dbs.myorg.com',
						PORT: '1521',
					},
				},
				CONNECT_DATA: {SERVICE_NAME: 'ABCD'}
			},
		}
	}, parse('ABCD=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=rac-scan.dbs.myorg.com)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=ABCD)))'))
	t.end()
})

test('toString', t => {
	t.equal('ABC=(X=Y)', parse('ABC = (X = Y)').toString())
	t.equal('ABC=(X=Y)\nDEF=(U=V)', parse('ABC = (X = Y) DEF = (U = V)').toString())
	t.end()
})
