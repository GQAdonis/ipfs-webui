import React from 'react'
import { connect } from '../lib/react-store.js'
import { withTranslation } from 'react-i18next'
import classnames from 'classnames'
import BrandWordmark from '../promethity/brand-wordmark.js'
import BrandPIcon from '../promethity/brand-p-icon.js'
import { BRAND } from '../promethity/brand.js'
// Nav icons come from the fork's single icon module only
// (src/promethity/icons.js; webui-shell-redesign 1.3).
import {
  StatusIcon,
  FilesIcon,
  ExploreIcon,
  PeersIcon,
  SettingsIcon,
  DiagnosticsIcon,
  PinnedIcon
} from '../promethity/icons.js'

// Styles
import './NavBar.css'

/**
 * @param {Object} props
 * @param {string} props.to
 * @param {React.ComponentType<import('lucide-react').LucideProps>} props.icon
 * @param {string} [props.alternative]
 * @param {boolean} [props.disabled]
 * @param {string} props.children
 */
const NavLink = ({
  to,
  icon,
  alternative,
  disabled,
  children
}) => {
  const Icon = icon
  const { hash } = window.location
  const href = `#${to}`
  const active = alternative
    ? hash === href || hash.startsWith(`${href}${alternative}`)
    : hash === href || (to !== '/' && hash.startsWith(`${href}/`)) || (to === '/' && (hash === '' || hash === '#'))
  const anchorClass = classnames({
    'navbar-item-active': active,
    'o-50 no-pointer-events': disabled
  }, ['navbar-item dib db-l pt2 pb3 pv1-l no-underline f5 tc'])

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href={disabled ? undefined : href} className={anchorClass} aria-current={active ? 'page' : undefined} title={children}>
      <div className='db ph2 pv1'>
        <div className='db'>
          <Icon />
        </div>
        <div className='db f6 tc navbar-item-label'>
          {children}
        </div>
      </div>
    </a>
  )
}

/**
 * @param {Object} props
 * @param {import('i18next').TFunction} props.t
 */
export const NavBar = ({ t }) => {
  const codeUrl = BRAND.forkRepo
  const bugsUrl = `${codeUrl}/issues`
  const gitRevision = process.env.REACT_APP_GIT_REV
  // Shown only when the node answers GET /index/status with a configured index and the
  // Web UI setting search.enabled is on; while off or unconnected, nothing is requested.
  const revisionUrl = `${codeUrl}/commit/${gitRevision}`
  return (
    <nav aria-label='Primary' className='praxis-wide-navigation h-100 fixed-l flex flex-column justify-between' style={{ overflowY: 'auto', width: 'inherit' }}>
      <div className='flex flex-column'>
        <a href="#/welcome" title={t('welcome:description')} className='navbar-brand'>
          <div className='pt3 pb1 pb2-l'>
            {/* One mark per surface: the wordmark on the expanded rail, the
                p-icon on the collapsed bar — never side by side. */}
            <BrandWordmark className='navbar-logo-vert center db-l dn pt3 pb1 ph2' style={{ width: '6.5rem' }} />
            <BrandPIcon className='navbar-logo-horiz center db dn-l' style={{ height: 56 }} />
          </div>
        </a>
        <div className='db overflow-x-scroll overflow-x-hidden-l nowrap tc'>
          <NavLink to='/' icon={StatusIcon}>Home</NavLink>
          <NavLink to='/files' icon={FilesIcon}>{t('files:title')}</NavLink>
          <NavLink to='/pins' icon={PinnedIcon}>{t('pins:title', { defaultValue: 'Pins' })}</NavLink>
          <NavLink to='/explore' icon={ExploreIcon}>{t('explore:tabName')}</NavLink>
          <NavLink to='/peers' icon={PeersIcon}>{t('peers:title')}</NavLink>
          <NavLink to='/activity' icon={DiagnosticsIcon}>Activity</NavLink>
          <NavLink to='/status' icon={StatusIcon}>{t('status:title')}</NavLink>
          <NavLink to='/settings' icon={SettingsIcon}>{t('settings:title')}</NavLink>
          <NavLink to='/diagnostics' icon={DiagnosticsIcon}>{t('diagnostics:title')}</NavLink>
        </div>
      </div>
      <div className='dn db-l navbar-footer mb2 tc center f7'>
        { gitRevision && <div className='mb1'>
          <a className='navbar-footer-link' href={revisionUrl} target='_blank' rel='noopener noreferrer'>{t('app:terms.revision')} {gitRevision}</a>
        </div> }
        <div className='mb1'>
          <a className='navbar-footer-link' href={codeUrl} target='_blank' rel='noopener noreferrer'>{t('app:nav.codeLink')}</a>
        </div>
        <div className='mb2'>
          <a className='navbar-footer-link' href={bugsUrl} target='_blank' rel='noopener noreferrer'>{t('app:nav.bugsLink')}</a>
        </div>
        <div className='ph2'>
          <a className='navbar-footer-link navbar-footer-attribution' href={BRAND.upstreamRepo} target='_blank' rel='noopener noreferrer'>{t('app:nav.attribution')}</a>
        </div>
      </div>
    </nav>
  )
}

export default connect(
  withTranslation()(NavBar)
)
