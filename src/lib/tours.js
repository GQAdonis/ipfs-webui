import React from 'react'
import AppHintTooltip from '../components/tour/AppHintTooltip.jsx'

/* Promethity tour skin (webui-shell-redesign 1.2). Tooltips are flat panels on
   the tokens: `raised` fill, `text` copy, the accent reserved for the Next
   action with an `on-accent` label. The app-hint tooltip is the section's one
   callout, so it sits on `accent-tint`. Every colour is a var() reference, so
   both themes resolve through the data-theme attribute in tokens.css. No
   borders, no shadows (kubo DESIGN.md). */

const tourPanelStyles = {
  tooltip: {
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)'
  },
  buttonNext: {
    backgroundColor: 'var(--accent)',
    color: 'var(--on-accent)',
    borderRadius: 'var(--radius-sm)'
  },
  buttonBack: {
    color: 'var(--text-muted)'
  },
  buttonSkip: {
    color: 'var(--text-muted)'
  },
  buttonClose: {
    color: 'var(--text-muted)'
  },
  options: {
    width: '500px',
    backgroundColor: 'var(--raised)',
    arrowColor: 'var(--raised)',
    primaryColor: 'var(--accent)',
    textColor: 'var(--text)',
    zIndex: 999
  }
}

/**
 * @type {{ getSteps: (props: any) => any[], styles: object }}
 */
export const appTour = {
  getSteps: ({ t }) => [{
    content: <div>
      <p className='ma0 pa0 tl f6'>{t('tour.tooltip')}</p>
    </div>,
    placement: 'left',
    target: '.joyride-app-tour',
    tooltipComponent: AppHintTooltip,
    disableFocusTrap: true,
    disableBeacon: true
  }],
  styles: {
    tooltip: tourPanelStyles.tooltip,
    tooltipContent: { padding: '0 20px 0 0' },
    tooltipFooter: { display: 'none' },
    options: {
      width: '250px',
      backgroundColor: 'var(--accent-tint)',
      arrowColor: 'var(--accent-tint)',
      textColor: 'var(--text)',
      zIndex: 999
    }
  }
}

/**
 * @type {{ getSteps: (props: any) => any[], styles: object }}
 */
export const welcomeTour = {
  getSteps: ({ t }) => [
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step1.title')}</h2>
        <p className='tl f6'>{t('tour.step1.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step1.paragraph2')}</p>
        <p className='tl f6'>{t('tour.step1.paragraph3')}</p>
      </div>,
      placement: 'center',
      target: 'body'
    }
  ],
  styles: tourPanelStyles
}

/**
 * @type {{ getSteps: (props: any) => any[], styles: object }}
 */
export const statusTour = {
  getSteps: ({ t, Trans }) => [
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step1.title')}</h2>
        <p className='tl f6'>{t('tour.step1.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step1.paragraph2')}</p>
      </div>,
      placement: 'center',
      target: 'body'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step2.title')}</h2>
        <p className='tl f6'>{t('tour.step2.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step2.paragraph2')}</p>
      </div>,
      placement: 'left',
      target: '.joyride-app-status'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step3.title')}</h2>
        <p className='tl f6'>{t('tour.step3.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step3.paragraph2')}</p>
        <Trans i18nKey='tour.step3.paragraph2' t={t}>
          <p className='tl f6'>Click on <code>Advanced</code> to see more info such as the gateway URL and addresses.</p>
        </Trans>
      </div>,
      placement: 'bottom',
      target: '.joyride-status-node'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step4.title')}</h2>
        <p className='tl f6'>{t('tour.step4.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step4.paragraph2')}</p>
      </div>,
      placement: 'top',
      target: '.joyride-status-charts'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.stepExplore.title')}</h2>
        <p className='tl f6'>{t('tour.stepExplore.paragraph')}</p>
      </div>,
      locale: { last: t('tour.finish') },
      placement: 'right',
      target: '.joyride-app-explore'
    }
  ],
  styles: tourPanelStyles
}

/**
 * @type {{ getSteps: (props: any) => any[], styles: object }}
 */
export const filesTour = {
  getSteps: ({ t, Trans }) => [
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step1.title')}</h2>
        <Trans i18nKey='tour.step1.paragraph1' t={t}>
          <p className='tl f6'>
            This is where the files on your <a className='teal link' href='https://docs.ipfs.tech/concepts/file-systems/' rel='noopener noreferrer' target='_blank'>
            Mutable File System (MFS)</a> live. You can add files or folders and manage them from this page.
          </p>
        </Trans>
        <p className='tl f6'>{t('tour.step1.paragraph2')}</p>
      </div>,
      placement: 'center',
      target: 'body'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step2.title')}</h2>
        <p className='tl f6'>{t('tour.step2.paragraph1')}</p>
        <ul className='pl4'>
          <li className='tl f6'>{t('tour.step2.bullet1')}</li>
          <li className='tl f6'>{t('tour.step2.bullet2')}</li>
          <li className='tl f6'>{t('tour.step2.bullet3')}</li>
        </ul>
      </div>,
      placement: 'bottom',
      target: '.joyride-files-breadcrumbs'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step3.title')}</h2>
        <p className='tl f6'>{t('tour.step3.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step3.paragraph2')}</p>
        <Trans i18nKey='tour.step3.paragraph3' t={t}>
          <p className='tl f6'>
            If you want to add something that is already on IPFS, you can import it to your MFS by passing its <a className='teal link' href='https://docs.ipfs.tech/concepts/content-addressing/' rel='noopener noreferrer' target='_blank'>Content
            Identifier (CID)</a>.
          </p>
        </Trans>
      </div>,
      placement: 'bottom',
      target: '.joyride-files-add'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step6.title')}</h2>
        <p className='tl f6'>{t('tour.step6.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step6.paragraph2')}</p>
      </div>,
      placement: 'bottom',
      target: '.filegrid-view'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step5.title')}</h2>
        <p className='tl f6'>{t('tour.step5.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step5.paragraph2')}</p>
        <p className='tl f6'>{t('tour.step5.paragraph3')}</p>
      </div>,
      locale: { last: t('tour.finish') },
      placement: 'bottom',
      target: '.filelist-view'
    }
  ],
  styles: tourPanelStyles
}

/**
 * @type {{ getSteps: (props: any) => any[], styles: object }}
 */
export const peersTour = {
  getSteps: ({ t }) => [
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step1.title')}</h2>
        <p className='tl f6'>{t('tour.step1.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step1.paragraph2')}</p>
      </div>,
      placement: 'center',
      target: 'body'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step2.title')}</h2>
        <p className='tl f6'>{t('tour.step2.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step2.paragraph2')}</p>
      </div>,
      placement: 'bottom',
      target: '.joyride-peers-map'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step3.title')}</h2>
        <p className='tl f6'>{t('tour.step3.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step3.paragraph2')}</p>
      </div>,
      locale: { last: t('tour.finish') },
      placement: 'top',
      target: '.joyride-peers-table'
    }
  ],
  styles: tourPanelStyles
}

/**
 * @type {{ getSteps: (props: any) => any[], styles: object }}
 */
export const settingsTour = {
  getSteps: ({ t, Trans }) => [
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step1.title')}</h2>
        <p className='tl f6'>{t('tour.step1.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step1.paragraph2')}</p>
      </div>,
      placement: 'center',
      target: 'body'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step2.title')}</h2>
        <p className='tl f6'>{t('tour.step2.paragraph1')}</p>
      </div>,
      placement: 'auto',
      target: '.joyride-settings-customapi'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step3.title')}</h2>
        <Trans i18nKey='tour.step3.paragraph1' t={t}>
          <p className='tl f6'>If you have accounts with third-party remote pinning services, add them here so you can pin/unpin items to those services directly from the Files screen. You can learn more about third-party pinning services in the <a className='teal link' href='https://docs.ipfs.tech/how-to/work-with-pinning-services' rel='noopener noreferrer' target='_blank'>IPFS Docs</a>.
          </p>
        </Trans>
      </div>,
      placement: 'auto',
      target: '.joyride-settings-pinning'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step4.title')}</h2>
        <Trans i18nKey='tour.step4.paragraph1' t={t}>
          <p className='tl f6'>You can change the language of the Web UI.
          If your preferred language isn&apos;t available, head over our project page in <a className='teal link' href='https://www.transifex.com/ipfs/ipfs-webui/translate/' rel='noopener noreferrer' target='_blank'>Transifex</a> to help us translate!
          </p>
        </Trans>
      </div>,
      placement: 'auto',
      target: '.joyride-settings-language'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step5.title')}</h2>
        <p className='tl f6'>{t('tour.step5.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step5.paragraph2')}</p>
      </div>,
      placement: 'auto',
      target: '.joyride-settings-analytics'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step6.title')}</h2>
        <p className='tl f6'>{t('tour.step6.paragraph1')}</p>
      </div>,
      placement: 'auto',
      target: '.joyride-settings-tutormode'
    },
    {
      content: <div>
        <h2 className='prom-tour-title'>{t('tour.step7.title')}</h2>
        <p className='tl f6'>{t('tour.step7.paragraph1')}</p>
        <p className='tl f6'>{t('tour.step7.paragraph2')}</p>
      </div>,
      locale: { last: t('tour.finish') },
      placement: 'auto',
      target: '.joyride-settings-config'
    }
  ],
  styles: tourPanelStyles
}
