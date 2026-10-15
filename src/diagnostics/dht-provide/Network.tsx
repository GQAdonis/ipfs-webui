import React from 'react'
import { useTranslation } from 'react-i18next'
import IconTooltip from '../../components/tooltip/icon-tooltip'
import { InfoIcon, OkIcon, WarnIcon } from '../../promethity/icons.js'
import type { SweepProvideStats } from '../../contexts/ProvideStat/types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../../components/card/card'
import { MetricRow } from '../../components/metric-row/MetricRow'
import { formatNumber, formatInteger, safeNumber } from './format-utils'

interface Props {
  sweep: SweepProvideStats
  fullRT?: boolean
}

export const Network: React.FC<Props> = ({ sweep, fullRT }) => {
  const { t } = useTranslation('diagnostics')

  const peers = safeNumber(sweep.network?.peers)
  const reachable = safeNumber(sweep.network?.reachable)

  const reachablePercent =
    peers > 0
      ? Math.round((reachable / peers) * 100)
      : 0

  return (
    <Card>
      <CardHeader className='flex justify-between items-center'>
        <CardTitle>{t('dhtProvide.network.title')}</CardTitle>
        <IconTooltip text={t('dhtProvide.network.tooltip')} position='top'>
          <InfoIcon className='fill-charcoal-muted pointer' size={22} />
        </IconTooltip>
      </CardHeader>

      <CardContent>
        <MetricRow
          label={t('dhtProvide.network.peerSwept')}
          value={formatInteger(peers)}
        />

        <MetricRow
          label={t('dhtProvide.network.reachablePeers')}
          value={`${formatInteger(reachable)} (${reachablePercent}%)`}
        />

        {(sweep.network?.avg_holders ?? 0) > 0 && (
          <MetricRow
            label={t('dhtProvide.network.avgRecordHolders')}
            value={formatNumber(sweep.network?.avg_holders, 1)}
          />
        )}

        {(sweep.network?.avg_region_size ?? 0) > 0 && (
          <MetricRow
            label={t('dhtProvide.network.avgRegionSize')}
            value={formatNumber(sweep.network?.avg_region_size, 1)}
          />
        )}

        <MetricRow
          label={t('dhtProvide.network.replicationFactor')}
          value={formatNumber(sweep.network?.replication_factor)}
        />

        <MetricRow
          label={t('dhtProvide.network.fullRT')}
          value={fullRT ? 'true' : 'false'}
        />

        <div className='flex items-center justify-between mb2'>
          <span className='f6'>{t('dhtProvide.network.fullKeyspaceCoverage')}</span>
          <span className='flex items-center f6'>
            {sweep.network?.complete_keyspace_coverage
              ? (
                <>
                  <OkIcon className='fill-green mr1' size={14} />
                  <span className='green fw5'>true</span>
                </>
                )
              : (
                <>
                  <WarnIcon className='fill-yellow mr1' size={14} />
                  <span className='yellow fw5'>false</span>
                </>
                )}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
