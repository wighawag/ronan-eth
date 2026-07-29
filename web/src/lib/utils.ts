type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(
	date: string | Date,
	dateStyle: DateStyle = 'medium',
	locales = 'en',
) {
	// mdsvex/yaml can parse unquoted dates into a Date object, or into an ISO
	// string. For plain YYYY-MM-DD strings we swap dashes for slashes because
	// Safari is mad about dashes; ISO strings (containing 'T') are left as-is.
	let dateToFormat: Date;
	if (date instanceof Date) {
		dateToFormat = date;
	} else if (date.includes('T')) {
		dateToFormat = new Date(date);
	} else {
		dateToFormat = new Date(date.replaceAll('-', '/'));
	}
	if (isNaN(dateToFormat.getTime())) {
		return '';
	}
	const dateFormatter = new Intl.DateTimeFormat(locales, {dateStyle});
	return dateFormatter.format(dateToFormat);
}
