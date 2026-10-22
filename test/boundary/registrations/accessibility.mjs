import { ACCESSIBILITY_FAMILIES, ACCESSIBILITY_SLOTS, contributionFailures, contributionStatus, loadContribution, runContribution, strongestContributionError } from '../accessibility/contributions.mjs'

// Exactly one WU registration per adopted slot. Each feature family supplies a named
// source-controlled contributor; the Desktop lane remains independently required.
export default ACCESSIBILITY_SLOTS.map(id => ({
  scenario: 'UI-112',
  id,
  requires: ['fixture-browser'],
  async run (ctx) {
    // The production accessor validates the complete current export. Individual
    // fixture evidence never bypasses this guard or acquires live-node authority.
    await ctx.getMetadata()
    const errors = []
    for (const family of ACCESSIBILITY_FAMILIES) {
      let failure
      try { await runContribution(ctx, await loadContribution(ctx, family), id) } catch (error) { failure = error; errors.push(error) }
      try {
        await ctx.record(`accessibility-${family}-${id}-outcome`, {
          schemaVersion: 1,
          kind: 'ui112-family-outcome',
          family,
          slot: id,
          status: contributionStatus(failure),
          failures: contributionFailures(failure),
          ...(failure?.contributionEvidence || {})
        })
      } catch (error) { errors.push(error) }
    }
    const failure = strongestContributionError(errors)
    if (failure) throw failure
  }
}))
