import ace from 'ace-builds/src-noconflict/ace'
// modified from https://github.com/thlorenz/brace/blob/master/theme/solarized_dark.js
ace.define('ace/theme/ipfs_dark', ['require', 'exports', 'module', 'ace/lib/dom'], function (acequire, exports, module) {
  exports.isDark = true
  exports.cssClass = 'ace-ipfs-dark'
  // Promethity: every colour is a token, so the editor follows the light and
  // dark themes. Syntax colour is limited to strings (info) and comments
  // (text-muted italic); everything else reads as primary text, because the
  // brand reserves the state hues for meaning.
  exports.cssText = `
  .ace-ipfs-dark .ace_gutter {
  background: var(--surface);
  color: var(--text-muted);
  }
  .ace-ipfs-dark .ace_print-margin {
  width: 1px;
  background: var(--control);
  }
  .ace-ipfs-dark {
  background-color: var(--surface);
  color: var(--text);
  }
  .ace-ipfs-dark .ace_entity.ace_other.ace_attribute-name,
  .ace-ipfs-dark .ace_storage {
  color: var(--text);
  }
  .ace-ipfs-dark .ace_rparen,
  .ace-ipfs-dark .ace_lparen {
    color: var(--text-muted);
  }
  .ace-ipfs-dark .ace_cursor {
  color: var(--accent);
  }
  .ace-ipfs-dark .ace_string.ace_regexp {
  color: var(--info);
  }
  .ace-ipfs-dark .ace_marker-layer .ace_active-line,
  .ace-ipfs-dark .ace_marker-layer .ace_selection {
  background: var(--control)
  }
  .ace-ipfs-dark.ace_multiselect .ace_selection.ace_start {
  box-shadow: none;
  }
  .ace-ipfs-dark .ace_marker-layer .ace_step {
  background: var(--warn-tint)
  }
  .ace-ipfs-dark .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid var(--text-muted)
  }
  .ace-ipfs-dark .ace_gutter-active-line {
  background-color: var(--control)
  }
  .ace-ipfs-dark .ace_marker-layer .ace_selected-word {
  border: 1px solid var(--text-muted)
  }
  .ace-ipfs-dark .ace_invisible {
  color: var(--text-muted)
  }
  .ace-ipfs-dark .ace_keyword,
  .ace-ipfs-dark .ace_meta,
  .ace-ipfs-dark .ace_support.ace_class,
  .ace-ipfs-dark .ace_support.ace_type,
  .ace-ipfs-dark .ace_constant.ace_character,
  .ace-ipfs-dark .ace_constant.ace_other,
  .ace-ipfs-dark .ace_constant.ace_language,
  .ace-ipfs-dark .ace_constant.ace_numeric {
  color: var(--text)
  }
  .ace-ipfs-dark .ace_fold {
  background-color: var(--control);
  border-color: var(--text-muted)
  }
  .ace-ipfs-dark .ace_entity.ace_name.ace_function,
  .ace-ipfs-dark .ace_entity.ace_name.ace_tag,
  .ace-ipfs-dark .ace_support.ace_function,
  .ace-ipfs-dark .ace_variable,
  .ace-ipfs-dark .ace_variable.ace_language {
  color: var(--text)
  }
  .ace-ipfs-dark .ace_string {
  color: var(--info)
  }
  .ace-ipfs-dark .ace_comment {
  font-style: italic;
  color: var(--text-muted)
  }
  .ace-ipfs-dark .ace_indent-guide {
  background: none;
  box-shadow: inset -1px 0 0 var(--control)
  }`

  const dom = acequire('../lib/dom')
  dom.importCssString(exports.cssText, exports.cssClass)
})
