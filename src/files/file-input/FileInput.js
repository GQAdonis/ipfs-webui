import React from 'react'
import { connect } from '../../lib/react-store.js'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { normalizeFiles } from '../../lib/files.js'
// Icons
import { DocumentIcon, FolderIcon, NewFolderIcon, AddByPathIcon, CarFileIcon, PlusIcon } from '../../promethity/icons.js'
// Components
import { Dropdown, DropdownMenu, Option } from '../dropdown/Dropdown.js'
import Button from '../../components/button/button.tsx'
import { cliCmdKeys } from '../../bundles/files/consts.js'

const AddButton = withTranslation('app')(
  ({ t, onClick }) => (
    <Button id='import-button' bg='bg-teal' className='f6 flex justify-center items-center' minWidth='100px' onClick={onClick}>
      <span className='inline-flex items-center'><PlusIcon size={16} className='mr1' />{t('actions.import')}</span>
    </Button>
  )
)

export class FileInput extends React.Component {
  state = {
    dropdown: false
  }

  toggleDropdown = () => {
    this.setState(s => ({ dropdown: !s.dropdown }))
  }

  onAddFolder = () => {
    this.toggleDropdown()
    return this.folderInput.click()
  }

  onAddFile = async () => {
    this.toggleDropdown()
    return this.filesInput.click()
  }

  onInputChange = (event) => {
    const input = event.currentTarget
    const files = Array.from(input.files || [])
    // Reset before publishing so the same file can be chosen after a failure.
    input.value = ''
    if (files.length) this.props.onAddFiles(normalizeFiles(files))
  }

  onAddByPath = () => {
    this.props.onAddByPath()
    this.toggleDropdown()
  }

  onAddByCar = () => {
    this.props.onAddByCar()
    this.toggleDropdown()
  }

  onBulkCidImport = () => {
    this.props.onBulkCidImport()
    this.toggleDropdown()
  }

  onNewFolder = () => {
    this.props.onNewFolder()
    this.toggleDropdown()
  }

  onCliTutorMode = async (cliOptions) => {
    await this.props.doSetCliOptions(cliOptions)
    this.props.onCliTutorMode()
    this.toggleDropdown()
  }

  render () {
    const { t, isCliTutorModeEnabled } = this.props

    return (
      <div className={this.props.className}>
        <Dropdown>
          <AddButton onClick={this.toggleDropdown} />
          <DropdownMenu
            top={3}
            open={this.state.dropdown}
            onDismiss={this.toggleDropdown} >
            <Option onClick={this.onAddFile} id='add-file' onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.ADD_FILE)}
              isCliTutorModeEnabled={isCliTutorModeEnabled}>
              <DocumentIcon className='mr2' />
              {t('app:terms.file')}
            </Option>
            <Option onClick={this.onAddFolder} id='add-folder' onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.ADD_DIRECTORY)}
              isCliTutorModeEnabled={isCliTutorModeEnabled}>
              <FolderIcon className='mr2' />
              {t('app:terms.folder')}
            </Option>
            <Option onClick={this.onNewFolder} id='add-new-folder' onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.CREATE_NEW_DIRECTORY)}
              isCliTutorModeEnabled={isCliTutorModeEnabled}>
              <NewFolderIcon className='mr2' />
              {t('newFolder')}
            </Option>
            <Option onClick={this.onAddByPath} id='add-by-path' onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.FROM_IPFS)}
              isCliTutorModeEnabled={isCliTutorModeEnabled}>
              <AddByPathIcon className='mr2' />
              {t('addByPath')}
            </Option>
            <Option onClick={this.onAddByCar} id='add-by-car' onCliTutorMode={() => this.onCliTutorMode(cliCmdKeys.FROM_CAR)}
              isCliTutorModeEnabled={isCliTutorModeEnabled}>
              <CarFileIcon className='mr2' />
              {t('addByCar')}
            </Option>
            <Option onClick={this.onBulkCidImport} id='bulk-cid-import'>
              <DocumentIcon className='mr2' />
              {t('bulkImport')}
            </Option>
          </DropdownMenu>
        </Dropdown>

        <input
          id='file-input'
          type='file'
          className='dn'
          multiple
          ref={el => { this.filesInput = el }}
          onChange={this.onInputChange} />

        <input
          id='directory-input'
          type='file'
          className='dn'
          multiple
          webkitdirectory='true'
          ref={el => { this.folderInput = el }}
          onChange={this.onInputChange} />
      </div>
    )
  }
}

FileInput.propTypes = {
  t: PropTypes.func.isRequired,
  onAddFiles: PropTypes.func.isRequired,
  onAddByPath: PropTypes.func.isRequired,
  onAddByCar: PropTypes.func.isRequired,
  onBulkCidImport: PropTypes.func.isRequired,
  onNewFolder: PropTypes.func.isRequired
}

export default connect(
  'selectIsCliTutorModeEnabled',
  'doOpenCliTutorModal',
  'doSetCliOptions',
  withTranslation('files')(FileInput)
)
