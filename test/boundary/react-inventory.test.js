// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { inspectReactSource } from './react-inventory.mjs'

describe('live React consumer negative controls', () => {
  it('detects legacy roots and named lookup imports instead of treating package pins as compatibility proof', () => {
    expect(inspectReactSource('ReactDOM.render(<App/>, target)').legacy).toContain('legacy DOM root')
    expect(inspectReactSource('import { findDOMNode } from "react-dom"; findDOMNode(ref)').legacy).toContain('removed DOM lookup')
    expect(inspectReactSource('class Binding { getChildContext () {} }').legacy).toContain('legacy context binding')
    expect(inspectReactSource('import { connect } from "redux-bundler-react"').legacy).toContain('legacy Redux adapter')
  })
  it('retains modern roots and adapters and ignores historical comment examples', () => {
    const result = inspectReactSource('// ReactDOM.render(old, target)\nimport { createRoot } from "react-dom/client"; import { connect } from "./react-store.js"; createRoot(target).render(tree)')
    expect(result.imports).toEqual(['react-dom/client'])
    expect(result.legacy).toEqual([])
  })
})
