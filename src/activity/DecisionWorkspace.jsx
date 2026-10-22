import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePresentationPolicy } from '../agent-chat/use-presentation-policy.js'
import { getConnectionStore } from '../agent-chat/connection-store.js'
import { PraxisWorkspace } from '../shell/PraxisWorkspace.jsx'
import { DecisionProjectionScope, useDecisionFeedApi } from './DecisionFeedProvider.jsx'
import { createInboxDecisionAdapter } from './inbox-adapter.js'
import { ActivityView, HomeInbox } from './DecisionViews.jsx'

/** Host-owned protected ingress is never supplied by a card or graph row. */
export function DecisionWorkspace (props) {
  const feed = useDecisionFeedApi()
  const { policy, preferences } = usePresentationPolicy(props.presentationPolicy)
  const [connectionStore] = useState(() => props.connectionStore ?? getConnectionStore())
  const [adapter] = useState(() => createInboxDecisionAdapter({ feed, connectionStore }))
  useEffect(() => {
    const sync = () => { if (policy.getSnapshot().decisions) adapter.start(); else adapter.stop() }
    sync()
    const unsubscribe = policy.subscribe(sync)
    return () => { unsubscribe(); adapter.stop() }
  }, [adapter, policy])
  useEffect(() => { adapter.close() }, [props.route, adapter])
  return <PraxisWorkspace {...props} presentationPolicy={policy} decisionCallbacks={adapter.callbacks}
    decisions={({ controller }) => preferences.decisions ? <DecisionProjectionScope><HomeInbox adapter={adapter} controller={controller} /></DecisionProjectionScope> : <DecisionDisplayOff />}
    application={props.route === '/activity' ? ({ controller }) => preferences.decisions ? <DecisionProjectionScope><ActivityView adapter={adapter} controller={controller} /></DecisionProjectionScope> : <DecisionDisplayOff activity /> : props.application} />
}

function DecisionDisplayOff ({ activity = false }) {
  const { t } = useTranslation('agentChat')
  const Heading = activity ? 'h1' : 'h2'
  return <section className='decision-inbox'><Heading>{t(activity ? 'presentation.activityTitle' : 'presentation.decisionsTitle')}</Heading>
    <p>{t('presentation.decisions.off')}</p><a href='#/settings/agent'>{t('presentation.settings')}</a></section>
}
