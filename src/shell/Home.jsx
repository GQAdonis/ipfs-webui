
/** Decisions/Activity are supplied by their later read-projection owner, never invented here. */
export function Home ({ composer, controller, assistantStatus, ipfsReady, decisions = null }) {
  return <section className='praxis-home' aria-labelledby='praxis-home-title'>
    <header><p className='praxis-eyebrow'>Your IPFS workspace</p><h1 id='praxis-home-title'>What would you like to do?</h1>
      <p>Open a CID or path, search indexed content, or ask about your node.</p></header>
    {composer}
    <div className='praxis-suggestions' role='group' aria-label='Draft suggestions'>
      <button type='button' onClick={() => { controller.setIntent('ask'); controller.setDraft('Show my node status') }}>Show my node status</button>
      <button type='button' onClick={() => { controller.setIntent('go'); controller.setDraft('/files') }}>Open Files</button>
      <button type='button' onClick={() => { controller.setIntent('search'); controller.setDraft('') }}>Search my content</button>
    </div>
    <div className='praxis-home-facts'><section><h2>Node</h2><p>{ipfsReady ? 'Connected' : 'Connecting or unavailable'}</p><a href='#/status'>Open node status</a></section>
      <section><h2>Assistant</h2><p>{assistantStatus}</p><a href='#/settings/agent'>Connection settings</a></section></div>
    {decisions}
  </section>
}

export function ActivityPage ({ children }) {
  return <section className='praxis-activity' aria-labelledby='praxis-activity-title'><h1 id='praxis-activity-title'>Activity</h1>
    {children ?? <p>Activity observations are not available in this view yet. Open the current conversation to inspect its reported outcomes.</p>}</section>
}

// The application host supplies Home's controller/composer; the router owns only its identity.
export function HomeRoute () { return null }
