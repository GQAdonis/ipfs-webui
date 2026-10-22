/** pnpm forwards run arguments directly; an npm-style separator becomes script input. */
export const localExportArgs = kubo => ['run', 'export:local', '--kubo', kubo]
