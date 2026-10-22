# Composed UI-112 contributors

Author only during production. `registrations/accessibility.mjs` owns the single WebUI registration for each of the four adopted UI-112 slots. Do not register a second copy. Desktop owns its independent SU slots.

Each named source file `contributions/{decisions,shell,a2ui,inbox,context}.mjs` exports:

```js
export default {
  schemaVersion: 1,
  family: 'shell',
  fixtures: [{ root: 'webui', path: 'test/boundary/accessibility/shell/fixture.mjs' }],
  slots: {
    'viewport-theme-matrix': async ctx => {},
    'keyboard-and-focus': async ctx => {},
    axe: async ctx => {},
    'reduced-motion': async ctx => {}
  }
}
```

The example is an interface, not passing coverage. Each callback must drive its actual current production surface, record named assertions with `ctx.assert`, and retain actual PNG evidence with `ctx.screenshot`; `ctx.record` retains additional public evidence. Generic verdict objects, empty callbacks, empty fixture lists and missing families block. Include every helper/build/browser fixture path used by the contributor. The registry binds the contributor and fixture bytes before import/execution, verifies they remain unchanged afterward, and records source hashes alongside observed assertions and hashed artifacts. Source paths must stay within the current WebUI/Kubo checkout and cannot be symlinks. Child evidence names are prefixed by family; session close artifacts receive unique run-local suffixes.

Use the existing boundary context/owned process APIs, current exported artifact and real browser. Credentials never belong in traces, screenshots, URL arguments or records. Role-palette evidence supplements these composed-surface checks. Shared synthetic presentation fixtures prove rendering/accessibility only: UI-103/UI-104 additionally require the dedicated actual broker/gate/handler/RPC driver and cannot pass from a component-only test command.

All five families and every four-slot implementation are mandatory at the final packet. Missing shell/A2UI/inbox/context files stay explicit blockers until their owning feature task authors them; they are not placeholder PASS modules. No tests, builds, browser or acceptance execution is authorized during this authoring task.

Each slot first uses the pinned fixture browser and `ctx.getMetadata`, whose production accessor verifies the complete current frontend export. It then independently loads, validates, hashes and executes decisions, shell, a2ui, inbox and context in that order. Every attempted family retains a `ui112-family-outcome` record, including an unsuccessful load or callback. An early blocker cannot suppress later evidence or hide a later assertion failure. The final slot preserves `FAIL > BLOCKED > NOT_EXERCISED > PASS`; all five families must supply successful bindings to pass. A failed outcome record never substitutes for a successful `ui112-contribution` binding.

Source hashes are checked after import/validation and after callbacks, including unsuccessful callbacks. A callback assertion failure plus source mutation retains both failures and remains `FAIL`. Unsuccessful callback outcomes retain their collected assertion count, input hashes and artifacts without granting a successful binding. Missing fixture bytes, path/symlink failures, empty callbacks, generic verdict objects, no actual assertions or no PNG evidence cannot pass. Unit regression callbacks, metadata and tiny PNGs are labelled orchestration-only fixtures; they never certify browser accessibility.

Runtime dependencies remain with each actual family. Decisions retain node-backed fixtures, and shell retains actual production shared-path hosting. A2UI/context/inbox may supply independent presentation/accessibility evidence after complete export validation; they do not supply authenticated observations, live effects, native presence or Desktop contributions. The shell authoring matrix covers 320/375/539/540/768/1024/1440/1920 in both themes with all existing viewport, keyboard, axe and reduced-motion checks. Authored widths are not observed browser evidence when the required node is unavailable. Whole UI-112 remains incomplete whenever any required family, slot or independent Desktop contribution is unavailable.

Current Q/1 supplies all five named families: decisions, shell, a2ui, inbox and context. Shell uses actual production shared-path hosting with truthful unavailable agent state and real phone More. Inbox uses actual provider/domain views with explicitly labelled read-only canonical graph fixtures; this supplies presentation/accessibility only, never authenticated observations, grants or live receipt acceptance. Protected live feed/continuation oracles remain their own registrations. Desktop supplies independent four-slot observations. No contributor was executed during authoring.
