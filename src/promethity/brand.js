// The one source for the Promethity product identity (D6). Every title,
// footer, manifest and about line that names the product reads this constant
// instead of hard-coding the name, so the acceptance grep can prove the name
// lives in exactly one place.

export const BRAND = Object.freeze({
  name: 'Promethity',
  tagline: 'Fire you can hold.'
})
