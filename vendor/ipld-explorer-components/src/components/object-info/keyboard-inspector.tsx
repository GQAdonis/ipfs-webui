import React from 'react'

// react-inspector supplies the same expandable previews as upstream. Delegate
// keyboard intent to those controls so byte/object views remain operable without
// maintaining a second object renderer or changing decoded IPLD data.
export function KeyboardInspector ({ children, label }: React.PropsWithChildren<{ label: string }>): React.ReactNode {
  const focus = (item?: HTMLElement | null): void => {
    if (!item) return
    item.tabIndex = -1
    item.focus()
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(event.key)) return
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"]'))
    const item = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]') ?? items[0]
    if (!item) return
    event.preventDefault()
    event.stopPropagation()
    const index = items.indexOf(item)
    if (event.key === 'ArrowDown') focus(items[Math.min(index + 1, items.length - 1)])
    else if (event.key === 'ArrowUp') focus(items[Math.max(index - 1, 0)])
    else if (event.key === 'Home') focus(items[0])
    else if (event.key === 'End') focus(items.at(-1))
    else if (event.key === 'Enter' || event.key === ' ') (item.firstElementChild as HTMLElement)?.click()
    else if (event.key === 'ArrowRight') {
      if (item.getAttribute('aria-expanded') === 'false') (item.firstElementChild as HTMLElement)?.click()
      else focus(item.querySelector<HTMLElement>('[role="treeitem"]'))
    } else if (item.getAttribute('aria-expanded') === 'true') (item.firstElementChild as HTMLElement)?.click()
    else focus(item.parentElement?.closest<HTMLElement>('[role="treeitem"]'))
  }
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- A single focus entry delegates keyboard intent to react-inspector's existing treeitems.
  return <div role='group' aria-label={label} tabIndex={0} onKeyDown={onKeyDown} onFocus={event => {
    if (event.target === event.currentTarget) focus(event.currentTarget.querySelector<HTMLElement>('[role="treeitem"]'))
  }}>{children}</div>
}
