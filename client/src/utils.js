export const fuzzyContains = (a, b) => a && b ? a.toLowerCase().indexOf(b.toLowerCase()) > -1 : true;
export const fuzzyContainsArr = (arr, b) => arr.some(el => fuzzyContains(el, b));
