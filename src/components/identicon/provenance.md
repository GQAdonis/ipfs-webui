# Identicon compatibility implementation

The five-by-five mirrored MD5 geometry, palette selection and integer cell sizing preserve `react-identicons@1.2.5`, authored by Tuhnik, published under ISC. Its React17 canvas wrapper is replaced with React19 SVG; no protocol hash is changed (MD5 is used for this decorative image only).

- Upstream: https://github.com/tuhnik/react-identicons/tree/8c7c81cc1a9bcb0e28f6a7e991b21fc3d62c5141
- Published integrity: `sha512-x7prkDoc2pD7wSl2C1pGxS+XAoSdq1ABWJWTBUimVTDVJArKOLd0B4wRUJpDm4r+9y7pgf8ylyPGsmlWSV5n2g==`
- The published package declares ISC but contains no separate license file. Retained attribution: Tuhnik, ISC. The standard ISC permission notice is reproduced in `LICENSE-ISC`.
- MD5 implementation: `blueimp-md5@2.19.0`, MIT, its package includes its license.
