import React, { useCallback, useMemo, useState } from 'react'
import * as isIPFS from 'is-ipfs'
import { useTranslation } from 'react-i18next'
import { isValidIpfsPath, normalizeToPath } from '../../lib/ipfs-path.js'
import { BrowseIcon, InspectIcon } from '../../promethity/icons.js'
import Button from '../../components/button/button'
import './files-explore-form.css'
// @ts-expect-error - need to fix types for ipfs-webui since we are a CJS consumer...
import { useExplore } from 'ipld-explorer-components/providers'
import { useBridgeSelector } from '../../helpers/context-bridge'
import type { KuboRPCClient } from 'kubo-rpc-client'

interface FilesExploreFormProps {
  // this prop is being passed as the `doFilesNavigateTo` action from the `files` bundle in App.js
  onBrowse: ({ path, cid }: {path: string, cid?: string}) => void
}

const FilesExploreForm: React.FC<FilesExploreFormProps> = ({ onBrowse: onBrowseProp }) => {
  const [path, setPath] = useState('')
  const [isResolving, setIsResolving] = useState(false)
  const [resolveError, setResolveError] = useState<string | null>(null)
  const { doExploreUserProvidedPath } = useExplore()
  const { t } = useTranslation('files')
  const ipfs = useBridgeSelector('selectIpfs') as KuboRPCClient | null

  const trimmedPath = useMemo(() => {
    return path.trim()
  }, [path])

  const isValid = useMemo(() => isValidIpfsPath(trimmedPath), [trimmedPath])

  const inputClass = useMemo(() => {
    if (trimmedPath === '') {
      return 'focus-outline'
    }

    if (isValid) {
      return 'b--green-muted focus-outline-green'
    } else {
      return 'b--red-muted focus-outline-red'
    }
  }, [trimmedPath, isValid])

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setPath(evt.target.value)
    if (resolveError != null) {
      setResolveError(null)
    }
  }
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (evt) => {
    if (evt.key === 'Enter') {
      onBrowse(evt)
    }
  }
  const onInspect = useCallback(async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()

    if (!isValid) return

    setResolveError(null)

    // Normalize URL to path format
    const normalizedPath = normalizeToPath(trimmedPath)

    // For bare CIDs, pass directly to explorer
    if (isIPFS.cid(trimmedPath)) {
      doExploreUserProvidedPath(trimmedPath)
      setPath('')
      return
    }

    // For paths (/ipfs/ or /ipns/), resolve to final CID
    if (ipfs != null && (normalizedPath.startsWith('/ipfs/') || normalizedPath.startsWith('/ipns/'))) {
      setIsResolving(true)
      try {
        // ipfs.resolve with recursive:true handles both IPNS resolution
        // and path traversal to get the final CID
        const resolved = await ipfs.resolve(normalizedPath, { recursive: true })
        // resolved is like "/ipfs/bafyabc123" - extract just the CID
        const cid = resolved.replace(/^\/ipfs\//, '')
        doExploreUserProvidedPath(cid)
        setPath('')
      } catch (err) {
        console.error('Failed to resolve path:', err)
        setResolveError(t('inspectResolveFailed', { path: normalizedPath }))
      } finally {
        setIsResolving(false)
      }
      return
    }

    // Fallback for other valid inputs
    doExploreUserProvidedPath(trimmedPath)
    setPath('')
  }, [doExploreUserProvidedPath, ipfs, isValid, t, trimmedPath])

  const onBrowse = useCallback((evt: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()

    if (isValid) {
      // Normalize URL to path, but preserve the full path for Files
      // (Files system handles IPNS and subpaths natively)
      let browsePath = normalizeToPath(trimmedPath)
      let cid
      if (isIPFS.cid(trimmedPath)) {
        browsePath = `/ipfs/${trimmedPath}`
        cid = trimmedPath
      }

      onBrowseProp({ path: browsePath, cid })
      setPath('')
    }
  }, [isValid, trimmedPath, onBrowseProp])

  return (
      <div data-id='FilesExploreForm' className='sans-serif'>
        <div className='ExploreForm'>
          <div className='ExploreFormInputWrap'>
            <input id='ipfs-path' className={`input-reset ExploreFormInput placeholder-light ${inputClass}`} type='text' placeholder='cid, ipfs://cid, or /ipfs/cid' aria-describedby='ipfs-path-desc' onChange={onChange} onKeyDown={onKeyDown} value={path} />
            <small id='ipfs-path-desc' className='ExploreFormHint'>Paste in a CID or IPFS path</small>
          </div>
          <div className='ExploreFormButtons'>
            <Button
              minWidth={0}
              disabled={!isValid}
              title={t('app:actions.browse')}
              onClick={onBrowse}
              bg='bg-gray'
              className='ExploreFormButton button-reset f7 fw4 overflow-hidden tc' >
              <BrowseIcon className='dib v-mid' />
              <span className='ExploreFormLabel'>{t('app:actions.browse')}</span>
            </Button>
            <Button
              minWidth={0}
              disabled={!isValid || isResolving}
              title={t('app:actions.inspect')}
              onClick={onInspect}
              bg='bg-gray'
              className={`ExploreFormButton button-reset f7 fw4 overflow-hidden tc ${isResolving ? 'o-50' : ''}`} >
              <InspectIcon className='dib v-mid' />
              <span className='ExploreFormLabel'>{isResolving ? t('app:actions.inspectResolving') : t('app:actions.inspect')}</span>
            </Button>
          </div>
        </div>
        {resolveError != null && (
          <div className='f6 red db mt2'>{resolveError}</div>
        )}
      </div>
  )
}

export default FilesExploreForm
