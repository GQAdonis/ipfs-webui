import React from 'react'
import { useTranslation } from 'react-i18next'
import IconTooltip from '../../components/tooltip/icon-tooltip'
import { InfoIcon } from '../../promethity/icons.js'
import type { SweepProvideStats } from '../../contexts/ProvideStat/types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../../components/card/card'
import { MetricRow } from '../../components/metric-row/MetricRow'
import { safeNumber, formatInteger } from './format-utils'

interface Props {
  sweep: SweepProvideStats
}

export const Queues: React.FC<Props> = ({ sweep }) => {
  const { t } = useTranslation('diagnostics')

  const pendingCids = safeNumber(sweep.queues?.pending_key_provides)
  const pendingRegionProvides = safeNumber(sweep.queues?.pending_region_provides)
  const pendingRegionReprovides = safeNumber(sweep.queues?.pending_region_reprovides)

  return (
    <Card>
      <CardHeader className='flex justify-between items-center'>
        <CardTitle>{t('dhtProvide.queues.title')}</CardTitle>
        <IconTooltip text={t('dhtProvide.queues.tooltip')} position='top'>
          <InfoIcon className='fill-charcoal-muted pointer' size={22} />
        </IconTooltip>
      </CardHeader>
      <CardContent>
        <MetricRow label={t('dhtProvide.queues.pendingCids')} value={formatInteger(pendingCids)} />

        <MetricRow label={t('dhtProvide.queues.pendingRegionProvides')} value={formatInteger(pendingRegionProvides)} />

        <MetricRow label={t('dhtProvide.queues.pendingRegionReprovides')} value={formatInteger(pendingRegionReprovides)} />
      </CardContent>
    </Card>
  )
}
