import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LogsScreen from './logs-screen/logs-screen.js'
import { LogsProvider } from '../contexts/logs/index'
import { IdentityProvider } from '../contexts/identity-context'
import CheckScreen from './check-screen/check-screen.js'
import { useBridgeSelector } from '../helpers/context-bridge'
import { RouteInfo } from '../bundles/routes-types'
import { ProvideProvider } from '../contexts/ProvideStat'

type TabKey = 'logs' | 'retrieval' | 'provider'

function getTabKeyFromUrl (path: string): { tab: TabKey, remainder?: string } {
  const parts = path.split('/').filter(p => p) // Remove empty strings

  if (parts.length === 0) {
    // Default to logs for empty path
    return { tab: 'logs' }
  }

  const tab = parts[0] as TabKey
  const remainder = parts.slice(1).join('/')

  return {
    tab,
    remainder: remainder || undefined
  }
}

interface TabButtonProps {
  tabKey: TabKey
  label: string
  active: boolean
}

const TabButton = ({ tabKey, label, active }: TabButtonProps) => (
  <a
    key={tabKey}
    href={`#/diagnostics/${tabKey}`}
    aria-current={active ? 'page' : undefined}
    className={`diagnostics-tab pv2 ph3 mr2 br2 pointer fw5 no-underline ${
      active
        ? 'bg-transparent'
        : 'bg-transparent charcoal-muted hover-bg-gray-muted hover-charcoal'
    }`}
    style={{
      // DESIGN.md: the active tab is accent-text at weight 600, no pill.
      ...(active && {
        color: 'var(--accent-text)',
        fontWeight: 600
      })
    }}
  >
    {label}
  </a>
)

const DiagnosticsContent: React.FC = () => {
  const { t } = useTranslation('diagnostics')
  const routeInfo = useBridgeSelector<RouteInfo>('selectRouteInfo')
  const path = routeInfo?.params?.path ?? ''
  const { tab: activeTab, remainder } = getTabKeyFromUrl(path)

  // Redirect from /diagnostics or /diagnostics/ to /diagnostics/logs
  useEffect(() => {
    if (!routeInfo) return
    const isRootDiagnostics = routeInfo.url === '/diagnostics' || routeInfo.url === '/diagnostics/'
    if (isRootDiagnostics && (path === '' || path === '/')) {
      window.location.replace('#/diagnostics/logs')
    }
  }, [path, routeInfo])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'logs':
        return (
          <IdentityProvider>
            <LogsProvider>
              <LogsScreen />
            </LogsProvider>
          </IdentityProvider>
        )
      case 'retrieval':
        return (
          <CheckScreen cid={remainder} />
        )
      case 'provider': {
        const DhtProvideScreen = require('./dht-provide/dht-provide-screen').default
        return (
          <IdentityProvider>
            <ProvideProvider>
              <DhtProvideScreen />
            </ProvideProvider>
          </IdentityProvider>
        )
      }
      default:
        return null
    }
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div className='mb4 pb2'>
        <nav className='flex items-center'>
          <TabButton tabKey='logs' label={t('tabs.logs')} active={activeTab === 'logs'} />
          <TabButton tabKey='retrieval' label={t('tabs.retrieval-check')} active={activeTab === 'retrieval'} />
          <TabButton tabKey='provider' label={t('tabs.dht-provide')} active={activeTab === 'provider'} />
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}

/**
 * @template {ReduxBundlerProps}
 */
export default DiagnosticsContent
