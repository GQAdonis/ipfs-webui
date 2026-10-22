import React from 'react'
import AceEditor from 'react-ace'

import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import jsonWorkerUrl from 'ace-builds/src-noconflict/worker-json.js?url'

import './theme/ipfs_dark.js'

ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl)

export class JsonEditor extends React.Component {
  render () {
    const { value, readOnly, onChange } = this.props
    const lineHeight = 16
    const height = Math.max(500, value.split('\n').length * lineHeight)

    return (
      <div className='pv3 bg-navy br2'>
        <AceEditor
          value={value}
          readOnly={readOnly}
          onChange={onChange}
          mode='json'
          theme='ipfs_dark'
          width='100%'
          height={height + 'px'}
          fontSize={12}
          showPrintMargin={false}
          showGutter
          editorProps={{ $blockScrolling: Infinity }}
          setOptions={{ showLineNumbers: true, tabSize: 2 }} />
      </div>
    )
  }
}

export default JsonEditor
