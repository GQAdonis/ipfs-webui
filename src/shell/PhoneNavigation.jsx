import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UiScope, Sheet, SheetTrigger, SheetContent } from '@gqadonis/ipfs-mcp-ui'
import '@gqadonis/ipfs-mcp-ui/styles.css'
import { StatusIcon, FilesIcon, PinnedIcon, DiagnosticsIcon, DotsIcon, ExploreIcon, PeersIcon, SettingsIcon } from '../promethity/icons.js'
import './phone-navigation.css'

const PHONE_MEDIA = '(max-width: 539px)'
const PRIMARY = [
  { path: '/', key: 'app:nav.home', label: 'Home', Icon: StatusIcon },
  { path: '/files', key: 'files:title', label: 'Files', Icon: FilesIcon, alternatives: ['/ipfs', '/ipns'] },
  { path: '/pins', key: 'pins:title', label: 'Pins', Icon: PinnedIcon },
  { path: '/activity', key: 'app:nav.activity', label: 'Activity', Icon: DiagnosticsIcon }
]
const MORE = [
  { path: '/explore', key: 'explore:tabName', label: 'Explore', Icon: ExploreIcon },
  { path: '/peers', key: 'peers:title', label: 'Peers', Icon: PeersIcon },
  { path: '/status', key: 'status:title', label: 'Status', Icon: StatusIcon },
  { path: '/diagnostics', key: 'diagnostics:title', label: 'Diagnostics', Icon: DiagnosticsIcon },
  { path: '/settings', key: 'settings:title', label: 'Settings', Icon: SettingsIcon }
]
const currentPath = route => (route.startsWith('#') ? route.slice(1) : route).split(/[?#]/)[0] || '/'
const matches = (route, item) => [item.path, ...(item.alternatives || [])].some(path => route === path || path !== '/' && route.startsWith(`${path}/`))
function phoneViewport () {
  try { return window.matchMedia(PHONE_MEDIA).matches } catch (_) { return false }
}

/** Navigation only: the host route owns the destination and its existing authorization. */
export function PhoneNavigation ({ route, theme }) {
  const { t } = useTranslation()
  const [phone, setPhone] = useState(phoneViewport)
  const [open, setOpen] = useState(false)
  const path = currentPath(route)
  useEffect(() => {
    let query
    try { query = window.matchMedia(PHONE_MEDIA) } catch (_) { return }
    const update = () => { setPhone(query.matches); if (!query.matches) setOpen(false) }
    update()
    if (query.addEventListener) query.addEventListener('change', update)
    else query.addListener?.(update)
    return () => {
      if (query.removeEventListener) query.removeEventListener('change', update)
      else query.removeListener?.(update)
    }
  }, [])
  useEffect(() => { setOpen(false) }, [route])
  const link = item => <a key={item.path} href={`#${item.path}`} aria-current={matches(path, item) ? 'page' : undefined} onClick={() => setOpen(false)}>
    <item.Icon aria-hidden='true' /><span>{t(item.key, { defaultValue: item.label })}</span>
  </a>
  return <UiScope theme={theme} injectStyles={false} overlays={phone} className='praxis-phone-navigation-scope'>
    <Sheet open={phone && open} onOpenChange={setOpen}>
      <nav className='praxis-phone-navigation' aria-label={t('app:nav.phone', { defaultValue: 'Primary navigation' })}>
        {PRIMARY.map(link)}
        <SheetTrigger className='praxis-phone-more-trigger' data-active={MORE.some(item => matches(path, item)) ? 'true' : undefined}>
          <DotsIcon aria-hidden='true' /><span>{t('app:nav.more', { defaultValue: 'More' })}</span>
        </SheetTrigger>
      </nav>
      <SheetContent side='bottom' className='praxis-phone-more' title={t('app:nav.moreDestinations', { defaultValue: 'More destinations' })}
        description={t('app:nav.moreDescription', { defaultValue: 'Explore and manage your IPFS node.' })}
        closeLabel={t('app:nav.closeMore', { defaultValue: 'Close more destinations' })}>
        <nav className='praxis-phone-more-links' aria-label={t('app:nav.moreDestinations', { defaultValue: 'More destinations' })}>{MORE.map(link)}</nav>
      </SheetContent>
    </Sheet>
  </UiScope>
}

export default PhoneNavigation
