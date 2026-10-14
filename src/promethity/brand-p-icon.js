import React from 'react'

// Promethity p-icon: the Syne 700 lowercase p with the flame held in the
// counter. Geometry is the brand master (branding/logo/p-icon, the tight
// 64x64 crop of the transparent mark) verbatim; fills resolve through the
// theme tokens so the same mark is exact in both themes: letter --text
// (#F5F2EE dark / #141210 light), flame --accent (#E96A12 dark / #CE3012
// light). The caller sizes it; never render it next to the wordmark
// (brand-wordmark.js) — one mark per surface.

/**
 * @param {React.SVGProps<SVGSVGElement> & { title?: string }} props title is the
 * accessible name; the mark stands for the product
 */
const BrandPIcon = ({ title = 'Promethity', ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' role='img' aria-label={title} {...props}>
    <g transform='translate(8.33 41.74) scale(0.0633)'>
      <path fill='var(--text)' d='M422 12Q356 12 309.5 -11.5Q263 -35 234 -73.5Q205 -112 191 -158Q177 -204 177 -248Q177 -303 190.5 -350Q204 -397 233 -432.5Q262 -468 308.5 -488Q355 -508 422 -508Q497 -508 557 -475Q617 -442 652.5 -383.5Q688 -325 688 -248Q688 -169 652 -110.5Q616 -52 556 -20Q496 12 422 12Z M380 -89Q433 -89 472.5 -109Q512 -129 533.5 -164.5Q555 -200 555 -248Q555 -320 509.5 -364Q464 -408 380 -408Q327 -408 283.5 -389Q240 -370 215 -334.5Q190 -299 190 -248Q190 -200 213 -164.5Q236 -129 279 -109Q322 -89 380 -89Z M60 -497H184L190 -365V200H60Z' />
      <path fill='var(--accent)' d='M 385.94 -370.50 C 392.23 -318.58 455.17 -271.38 455.17 -210.02 C 455.17 -167.54 420.55 -134.50 376.50 -134.50 C 332.45 -134.50 297.83 -167.54 297.83 -214.74 C 297.83 -252.50 319.86 -271.38 335.59 -306.78 C 345.03 -283.18 360.77 -276.10 368.63 -290.26 C 382.79 -313.86 376.50 -346.90 385.94 -370.50 Z' />
    </g>
  </svg>
)

export default BrandPIcon
