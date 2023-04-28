export const formatDate = value => {
	const date = new Date(value)
	let y = date.getFullYear(),
		m: string | number = date.getMonth() + 1,
		d: string | number = date.getDate(),
		h: string | number = date.getHours(),
		i: string | number = date.getMinutes(),
		s: string | number = date.getSeconds()
	if (m < 10) {
		m = '0' + m
	}
	if (d < 10) {
		d = '0' + d
	}
	if (h < 10) {
		h = '0' + h
	}
	if (i < 10) {
		i = '0' + i
	}
	if (s < 10) {
		s = '0' + s
	}
	const t = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s
	return t
}
