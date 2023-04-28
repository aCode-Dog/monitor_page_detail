import { SourceMapConsumer } from 'source-map-js'
const originalPositionFor = async props => {
	const { mapFile, callback } = props

	const { lineno, colno, mapFiles } = mapFile

	const consumer = await new SourceMapConsumer(JSON.parse(mapFiles))
	const pos = lineno
		? consumer.originalPositionFor({
				line: lineno,
				column: colno,
		  })
		: null
	if (pos && pos.source) {
		const sourceIndex = (consumer as any).sources.findIndex(item => item === pos.source)
		const sourceContent = (consumer as any).sourcesContent[sourceIndex]
		const contentRowArr = sourceContent.split('\n')
		const start = pos.line - 5 >= 0 ? pos.line - 5 : 0,
			end = start + 9 >= contentRowArr.length ? contentRowArr.length : start + 9
		const newLines: string[] = []
		let j = 0
		for (let i = start; i <= end; i++) {
			j++
			newLines.push(`${i + 1}. ${repalceAll(contentRowArr[i])}`)
		}
		callback(newLines, pos.source)
	}
}
const repalceAll = str => {
	return str.replace(new RegExp(' ', 'gm'), '\u00A0')
}
export default originalPositionFor
