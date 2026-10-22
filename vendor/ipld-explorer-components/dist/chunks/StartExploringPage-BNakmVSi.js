import { t as CID } from "./cid-BdjsvP7U.js";
import { s as getCodecNameFromCode } from "./explore-DAWbd7Iy.js";
import { t as IpldExploreForm } from "./IpldExploreForm-Boma9nMv.js";
import React, { Children, createContext, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { jsx, jsxs } from "react/jsx-runtime";
import theme from "ipfs-css/theme.json";
import { Joyride } from "react-joyride";
//#region vendor/ipld-explorer-components/node_modules/filesize/dist/filesize.esm.js
/**
* filesize
*
* @copyright 2024 Jason Mulligan <jason.mulligan@avoidwork.com>
* @license BSD-3-Clause
* @version 10.1.6
*/
var ARRAY = "array";
var BIT = "bit";
var BITS = "bits";
var BYTE = "byte";
var BYTES = "bytes";
var EMPTY = "";
var EXPONENT = "exponent";
var FUNCTION = "function";
var IEC = "iec";
var INVALID_NUMBER = "Invalid number";
var INVALID_ROUND = "Invalid rounding method";
var JEDEC = "jedec";
var OBJECT = "object";
var PERIOD = ".";
var ROUND = "round";
var S = "s";
var SI = "si";
var SI_KBIT = "kbit";
var SI_KBYTE = "kB";
var SPACE = " ";
var STRING = "string";
var ZERO = "0";
var STRINGS = {
	symbol: {
		iec: {
			bits: [
				"bit",
				"Kibit",
				"Mibit",
				"Gibit",
				"Tibit",
				"Pibit",
				"Eibit",
				"Zibit",
				"Yibit"
			],
			bytes: [
				"B",
				"KiB",
				"MiB",
				"GiB",
				"TiB",
				"PiB",
				"EiB",
				"ZiB",
				"YiB"
			]
		},
		jedec: {
			bits: [
				"bit",
				"Kbit",
				"Mbit",
				"Gbit",
				"Tbit",
				"Pbit",
				"Ebit",
				"Zbit",
				"Ybit"
			],
			bytes: [
				"B",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB"
			]
		}
	},
	fullform: {
		iec: [
			"",
			"kibi",
			"mebi",
			"gibi",
			"tebi",
			"pebi",
			"exbi",
			"zebi",
			"yobi"
		],
		jedec: [
			"",
			"kilo",
			"mega",
			"giga",
			"tera",
			"peta",
			"exa",
			"zetta",
			"yotta"
		]
	}
};
function filesize(arg, { bits = false, pad = false, base = -1, round = 2, locale = EMPTY, localeOptions = {}, separator = EMPTY, spacer = SPACE, symbols = {}, standard = EMPTY, output = STRING, fullform = false, fullforms = [], exponent = -1, roundingMethod = ROUND, precision = 0 } = {}) {
	let e = exponent, num = Number(arg), result = [], val = 0, u = EMPTY;
	if (standard === SI) {
		base = 10;
		standard = JEDEC;
	} else if (standard === IEC || standard === JEDEC) base = 2;
	else if (base === 2) standard = IEC;
	else {
		base = 10;
		standard = JEDEC;
	}
	const ceil = base === 10 ? 1e3 : 1024, full = fullform === true, neg = num < 0, roundingFunc = Math[roundingMethod];
	if (typeof arg !== "bigint" && isNaN(arg)) throw new TypeError(INVALID_NUMBER);
	if (typeof roundingFunc !== FUNCTION) throw new TypeError(INVALID_ROUND);
	if (neg) num = -num;
	if (e === -1 || isNaN(e)) {
		e = Math.floor(Math.log(num) / Math.log(ceil));
		if (e < 0) e = 0;
	}
	if (e > 8) {
		if (precision > 0) precision += 8 - e;
		e = 8;
	}
	if (output === EXPONENT) return e;
	if (num === 0) {
		result[0] = 0;
		u = result[1] = STRINGS.symbol[standard][bits ? BITS : BYTES][e];
	} else {
		val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1e3, e));
		if (bits) {
			val = val * 8;
			if (val >= ceil && e < 8) {
				val = val / ceil;
				e++;
			}
		}
		const p = Math.pow(10, e > 0 ? round : 0);
		result[0] = roundingFunc(val * p) / p;
		if (result[0] === ceil && e < 8 && exponent === -1) {
			result[0] = 1;
			e++;
		}
		u = result[1] = base === 10 && e === 1 ? bits ? SI_KBIT : SI_KBYTE : STRINGS.symbol[standard][bits ? BITS : BYTES][e];
	}
	if (neg) result[0] = -result[0];
	if (precision > 0) result[0] = result[0].toPrecision(precision);
	result[1] = symbols[result[1]] || result[1];
	if (locale === true) result[0] = result[0].toLocaleString();
	else if (locale.length > 0) result[0] = result[0].toLocaleString(locale, localeOptions);
	else if (separator.length > 0) result[0] = result[0].toString().replace(PERIOD, separator);
	if (pad && round > 0) {
		const i = result[0].toString(), x = separator || (i.match(/(\D)/g) || []).pop() || PERIOD, tmp = i.toString().split(x), s = tmp[1] || EMPTY, l = s.length, n = round - l;
		result[0] = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
	}
	if (full) result[1] = fullforms[e] ? fullforms[e] : STRINGS.fullform[standard][e] + (bits ? BIT : BYTE) + (result[0] === 1 ? EMPTY : S);
	return output === ARRAY ? result : output === OBJECT ? {
		value: result[0],
		symbol: result[1],
		exponent: e,
		unit: u
	} : result.join(spacer);
}
function partial({ bits = false, pad = false, base = -1, round = 2, locale = EMPTY, localeOptions = {}, separator = EMPTY, spacer = SPACE, symbols = {}, standard = EMPTY, output = STRING, fullform = false, fullforms = [], exponent = -1, roundingMethod = ROUND, precision = 0 } = {}) {
	return (arg) => filesize(arg, {
		bits,
		pad,
		base,
		round,
		locale,
		localeOptions,
		separator,
		spacer,
		symbols,
		standard,
		output,
		fullform,
		fullforms,
		exponent,
		roundingMethod,
		precision
	});
}
//#endregion
//#region vendor/ipld-explorer-components/node_modules/react-inspector/dist/index.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_is_object = __commonJS({ "node_modules/is-object/index.js"(exports, module) {
	"use strict";
	module.exports = function isObject(x) {
		return typeof x === "object" && x !== null;
	};
} });
var require_is_window = __commonJS({ "node_modules/is-window/index.js"(exports, module) {
	"use strict";
	module.exports = function(obj) {
		if (obj == null) return false;
		var o = Object(obj);
		return o === o.window;
	};
} });
var require_is_dom = __commonJS({ "node_modules/is-dom/index.js"(exports, module) {
	"use strict";
	var isObject = require_is_object();
	var isWindow = require_is_window();
	function isNode(val) {
		if (!isObject(val) || !isWindow(window) || typeof window.Node !== "function") return false;
		return typeof val.nodeType === "number" && typeof val.nodeName === "string";
	}
	module.exports = isNode;
} });
var themes_exports = {};
__export(themes_exports, {
	chromeDark: () => theme$1,
	chromeLight: () => theme2
});
var theme$1 = {
	BASE_FONT_FAMILY: "Menlo, monospace",
	BASE_FONT_SIZE: "11px",
	BASE_LINE_HEIGHT: 1.2,
	BASE_BACKGROUND_COLOR: "rgb(36, 36, 36)",
	BASE_COLOR: "rgb(213, 213, 213)",
	OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
	OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
	OBJECT_NAME_COLOR: "rgb(227, 110, 236)",
	OBJECT_VALUE_NULL_COLOR: "rgb(127, 127, 127)",
	OBJECT_VALUE_UNDEFINED_COLOR: "rgb(127, 127, 127)",
	OBJECT_VALUE_REGEXP_COLOR: "rgb(233, 63, 59)",
	OBJECT_VALUE_STRING_COLOR: "rgb(233, 63, 59)",
	OBJECT_VALUE_SYMBOL_COLOR: "rgb(233, 63, 59)",
	OBJECT_VALUE_NUMBER_COLOR: "hsl(252, 100%, 75%)",
	OBJECT_VALUE_BOOLEAN_COLOR: "hsl(252, 100%, 75%)",
	OBJECT_VALUE_FUNCTION_PREFIX_COLOR: "rgb(85, 106, 242)",
	HTML_TAG_COLOR: "rgb(93, 176, 215)",
	HTML_TAGNAME_COLOR: "rgb(93, 176, 215)",
	HTML_TAGNAME_TEXT_TRANSFORM: "lowercase",
	HTML_ATTRIBUTE_NAME_COLOR: "rgb(155, 187, 220)",
	HTML_ATTRIBUTE_VALUE_COLOR: "rgb(242, 151, 102)",
	HTML_COMMENT_COLOR: "rgb(137, 137, 137)",
	HTML_DOCTYPE_COLOR: "rgb(192, 192, 192)",
	ARROW_COLOR: "rgb(145, 145, 145)",
	ARROW_MARGIN_RIGHT: 3,
	ARROW_FONT_SIZE: 12,
	ARROW_ANIMATION_DURATION: "0",
	TREENODE_FONT_FAMILY: "Menlo, monospace",
	TREENODE_FONT_SIZE: "11px",
	TREENODE_LINE_HEIGHT: 1.2,
	TREENODE_PADDING_LEFT: 12,
	TABLE_BORDER_COLOR: "rgb(85, 85, 85)",
	TABLE_TH_BACKGROUND_COLOR: "rgb(44, 44, 44)",
	TABLE_TH_HOVER_COLOR: "rgb(48, 48, 48)",
	TABLE_SORT_ICON_COLOR: "black",
	TABLE_DATA_BACKGROUND_IMAGE: "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(51, 139, 255, 0.0980392) 50%, rgba(51, 139, 255, 0.0980392))",
	TABLE_DATA_BACKGROUND_SIZE: "128px 32px"
};
var theme2 = {
	BASE_FONT_FAMILY: "Menlo, monospace",
	BASE_FONT_SIZE: "11px",
	BASE_LINE_HEIGHT: 1.2,
	BASE_BACKGROUND_COLOR: "white",
	BASE_COLOR: "black",
	OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
	OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
	OBJECT_NAME_COLOR: "rgb(136, 19, 145)",
	OBJECT_VALUE_NULL_COLOR: "rgb(128, 128, 128)",
	OBJECT_VALUE_UNDEFINED_COLOR: "rgb(128, 128, 128)",
	OBJECT_VALUE_REGEXP_COLOR: "rgb(196, 26, 22)",
	OBJECT_VALUE_STRING_COLOR: "rgb(196, 26, 22)",
	OBJECT_VALUE_SYMBOL_COLOR: "rgb(196, 26, 22)",
	OBJECT_VALUE_NUMBER_COLOR: "rgb(28, 0, 207)",
	OBJECT_VALUE_BOOLEAN_COLOR: "rgb(28, 0, 207)",
	OBJECT_VALUE_FUNCTION_PREFIX_COLOR: "rgb(13, 34, 170)",
	HTML_TAG_COLOR: "rgb(168, 148, 166)",
	HTML_TAGNAME_COLOR: "rgb(136, 18, 128)",
	HTML_TAGNAME_TEXT_TRANSFORM: "lowercase",
	HTML_ATTRIBUTE_NAME_COLOR: "rgb(153, 69, 0)",
	HTML_ATTRIBUTE_VALUE_COLOR: "rgb(26, 26, 166)",
	HTML_COMMENT_COLOR: "rgb(35, 110, 37)",
	HTML_DOCTYPE_COLOR: "rgb(192, 192, 192)",
	ARROW_COLOR: "#6e6e6e",
	ARROW_MARGIN_RIGHT: 3,
	ARROW_FONT_SIZE: 12,
	ARROW_ANIMATION_DURATION: "0",
	TREENODE_FONT_FAMILY: "Menlo, monospace",
	TREENODE_FONT_SIZE: "11px",
	TREENODE_LINE_HEIGHT: 1.2,
	TREENODE_PADDING_LEFT: 12,
	TABLE_BORDER_COLOR: "#aaa",
	TABLE_TH_BACKGROUND_COLOR: "#eee",
	TABLE_TH_HOVER_COLOR: "hsla(0, 0%, 90%, 1)",
	TABLE_SORT_ICON_COLOR: "#6e6e6e",
	TABLE_DATA_BACKGROUND_IMAGE: "linear-gradient(to bottom, white, white 50%, rgb(234, 243, 255) 50%, rgb(234, 243, 255))",
	TABLE_DATA_BACKGROUND_SIZE: "128px 32px"
};
var ExpandedPathsContext = createContext([{}, () => {}]);
var unselectable = {
	WebkitTouchCallout: "none",
	WebkitUserSelect: "none",
	KhtmlUserSelect: "none",
	MozUserSelect: "none",
	msUserSelect: "none",
	OUserSelect: "none",
	userSelect: "none"
};
var createTheme = (theme3) => ({
	DOMNodePreview: {
		htmlOpenTag: {
			base: { color: theme3.HTML_TAG_COLOR },
			tagName: {
				color: theme3.HTML_TAGNAME_COLOR,
				textTransform: theme3.HTML_TAGNAME_TEXT_TRANSFORM
			},
			htmlAttributeName: { color: theme3.HTML_ATTRIBUTE_NAME_COLOR },
			htmlAttributeValue: { color: theme3.HTML_ATTRIBUTE_VALUE_COLOR }
		},
		htmlCloseTag: {
			base: { color: theme3.HTML_TAG_COLOR },
			offsetLeft: { marginLeft: -theme3.TREENODE_PADDING_LEFT },
			tagName: {
				color: theme3.HTML_TAGNAME_COLOR,
				textTransform: theme3.HTML_TAGNAME_TEXT_TRANSFORM
			}
		},
		htmlComment: { color: theme3.HTML_COMMENT_COLOR },
		htmlDoctype: { color: theme3.HTML_DOCTYPE_COLOR }
	},
	ObjectPreview: {
		objectDescription: { fontStyle: "italic" },
		preview: { fontStyle: "italic" },
		arrayMaxProperties: theme3.OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES,
		objectMaxProperties: theme3.OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES
	},
	ObjectName: {
		base: { color: theme3.OBJECT_NAME_COLOR },
		dimmed: { opacity: .6 }
	},
	ObjectValue: {
		objectValueNull: { color: theme3.OBJECT_VALUE_NULL_COLOR },
		objectValueUndefined: { color: theme3.OBJECT_VALUE_UNDEFINED_COLOR },
		objectValueRegExp: { color: theme3.OBJECT_VALUE_REGEXP_COLOR },
		objectValueString: { color: theme3.OBJECT_VALUE_STRING_COLOR },
		objectValueSymbol: { color: theme3.OBJECT_VALUE_SYMBOL_COLOR },
		objectValueNumber: { color: theme3.OBJECT_VALUE_NUMBER_COLOR },
		objectValueBoolean: { color: theme3.OBJECT_VALUE_BOOLEAN_COLOR },
		objectValueFunctionPrefix: {
			color: theme3.OBJECT_VALUE_FUNCTION_PREFIX_COLOR,
			fontStyle: "italic"
		},
		objectValueFunctionName: { fontStyle: "italic" }
	},
	TreeView: { treeViewOutline: {
		padding: 0,
		margin: 0,
		listStyleType: "none"
	} },
	TreeNode: {
		treeNodeBase: {
			color: theme3.BASE_COLOR,
			backgroundColor: theme3.BASE_BACKGROUND_COLOR,
			lineHeight: theme3.TREENODE_LINE_HEIGHT,
			cursor: "default",
			boxSizing: "border-box",
			listStyle: "none",
			fontFamily: theme3.TREENODE_FONT_FAMILY,
			fontSize: theme3.TREENODE_FONT_SIZE
		},
		treeNodePreviewContainer: {},
		treeNodePlaceholder: {
			whiteSpace: "pre",
			fontSize: theme3.ARROW_FONT_SIZE,
			marginRight: theme3.ARROW_MARGIN_RIGHT,
			...unselectable
		},
		treeNodeArrow: {
			base: {
				color: theme3.ARROW_COLOR,
				display: "inline-block",
				fontSize: theme3.ARROW_FONT_SIZE,
				marginRight: theme3.ARROW_MARGIN_RIGHT,
				...parseFloat(theme3.ARROW_ANIMATION_DURATION) > 0 ? { transition: `transform ${theme3.ARROW_ANIMATION_DURATION} ease 0s` } : {},
				...unselectable
			},
			expanded: {
				WebkitTransform: "rotateZ(90deg)",
				MozTransform: "rotateZ(90deg)",
				transform: "rotateZ(90deg)"
			},
			collapsed: {
				WebkitTransform: "rotateZ(0deg)",
				MozTransform: "rotateZ(0deg)",
				transform: "rotateZ(0deg)"
			}
		},
		treeNodeChildNodesContainer: {
			margin: 0,
			paddingLeft: theme3.TREENODE_PADDING_LEFT
		}
	},
	TableInspector: { base: {
		color: theme3.BASE_COLOR,
		position: "relative",
		border: `1px solid ${theme3.TABLE_BORDER_COLOR}`,
		fontFamily: theme3.BASE_FONT_FAMILY,
		fontSize: theme3.BASE_FONT_SIZE,
		lineHeight: "120%",
		boxSizing: "border-box",
		cursor: "default"
	} },
	TableInspectorHeaderContainer: {
		base: {
			top: 0,
			height: "17px",
			left: 0,
			right: 0,
			overflowX: "hidden"
		},
		table: {
			tableLayout: "fixed",
			borderSpacing: 0,
			borderCollapse: "separate",
			height: "100%",
			width: "100%",
			margin: 0
		}
	},
	TableInspectorDataContainer: {
		tr: { display: "table-row" },
		td: {
			boxSizing: "border-box",
			border: "none",
			height: "16px",
			verticalAlign: "top",
			padding: "1px 4px",
			WebkitUserSelect: "text",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden",
			lineHeight: "14px"
		},
		div: {
			position: "static",
			top: "17px",
			bottom: 0,
			overflowY: "overlay",
			transform: "translateZ(0)",
			left: 0,
			right: 0,
			overflowX: "hidden"
		},
		table: {
			positon: "static",
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			borderTop: "0 none transparent",
			margin: 0,
			backgroundImage: theme3.TABLE_DATA_BACKGROUND_IMAGE,
			backgroundSize: theme3.TABLE_DATA_BACKGROUND_SIZE,
			tableLayout: "fixed",
			borderSpacing: 0,
			borderCollapse: "separate",
			width: "100%",
			fontSize: theme3.BASE_FONT_SIZE,
			lineHeight: "120%"
		}
	},
	TableInspectorTH: {
		base: {
			position: "relative",
			height: "auto",
			textAlign: "left",
			backgroundColor: theme3.TABLE_TH_BACKGROUND_COLOR,
			borderBottom: `1px solid ${theme3.TABLE_BORDER_COLOR}`,
			fontWeight: "normal",
			verticalAlign: "middle",
			padding: "0 4px",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden",
			lineHeight: "14px",
			":hover": { backgroundColor: theme3.TABLE_TH_HOVER_COLOR }
		},
		div: {
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden",
			fontSize: theme3.BASE_FONT_SIZE,
			lineHeight: "120%"
		}
	},
	TableInspectorLeftBorder: {
		none: { borderLeft: "none" },
		solid: { borderLeft: `1px solid ${theme3.TABLE_BORDER_COLOR}` }
	},
	TableInspectorSortIcon: {
		display: "block",
		marginRight: 3,
		width: 8,
		height: 7,
		marginTop: -7,
		color: theme3.TABLE_SORT_ICON_COLOR,
		fontSize: 12,
		...unselectable
	}
});
var DEFAULT_THEME_NAME = "chromeLight";
var ThemeContext = createContext(createTheme(themes_exports[DEFAULT_THEME_NAME]));
var useStyles = (baseStylesKey) => {
	return useContext(ThemeContext)[baseStylesKey];
};
var themeAcceptor = (WrappedComponent) => {
	const ThemeAcceptor = ({ theme: theme3 = DEFAULT_THEME_NAME, ...restProps }) => {
		const themeStyles = useMemo(() => {
			switch (Object.prototype.toString.call(theme3)) {
				case "[object String]": return createTheme(themes_exports[theme3]);
				case "[object Object]": return createTheme(theme3);
				default: return createTheme(themes_exports[DEFAULT_THEME_NAME]);
			}
		}, [theme3]);
		return /* @__PURE__ */ React.createElement(ThemeContext.Provider, { value: themeStyles }, /* @__PURE__ */ React.createElement(WrappedComponent, { ...restProps }));
	};
	return ThemeAcceptor;
};
var Arrow = ({ expanded, styles }) => /* @__PURE__ */ React.createElement("span", { style: {
	...styles.base,
	...expanded ? styles.expanded : styles.collapsed
} }, "▶");
var TreeNode = memo((props) => {
	props = {
		expanded: true,
		nodeRenderer: ({ name }) => /* @__PURE__ */ React.createElement("span", null, name),
		onClick: () => {},
		shouldShowArrow: false,
		shouldShowPlaceholder: true,
		...props
	};
	const { expanded, onClick, children, nodeRenderer, title, shouldShowArrow, shouldShowPlaceholder } = props;
	const styles = useStyles("TreeNode");
	const NodeRenderer = nodeRenderer;
	return /* @__PURE__ */ React.createElement("li", {
		"aria-expanded": expanded,
		role: "treeitem",
		style: styles.treeNodeBase,
		title
	}, /* @__PURE__ */ React.createElement("div", {
		style: styles.treeNodePreviewContainer,
		onClick
	}, shouldShowArrow || Children.count(children) > 0 ? /* @__PURE__ */ React.createElement(Arrow, {
		expanded,
		styles: styles.treeNodeArrow
	}) : shouldShowPlaceholder && /* @__PURE__ */ React.createElement("span", { style: styles.treeNodePlaceholder }, "\xA0"), /* @__PURE__ */ React.createElement(NodeRenderer, { ...props })), /* @__PURE__ */ React.createElement("ol", {
		role: "group",
		style: styles.treeNodeChildNodesContainer
	}, expanded ? children : void 0));
});
var DEFAULT_ROOT_PATH = "$";
var WILDCARD = "*";
function hasChildNodes(data, dataIterator) {
	return !dataIterator(data).next().done;
}
var wildcardPathsFromLevel = (level) => {
	return Array.from({ length: level }, (_, i) => [DEFAULT_ROOT_PATH].concat(Array.from({ length: i }, () => "*")).join("."));
};
var getExpandedPaths = (data, dataIterator, expandPaths, expandLevel, prevExpandedPaths) => {
	const wildcardPaths = [].concat(wildcardPathsFromLevel(expandLevel)).concat(expandPaths).filter((path) => typeof path === "string");
	const expandedPaths = [];
	wildcardPaths.forEach((wildcardPath) => {
		const keyPaths = wildcardPath.split(".");
		const populatePaths = (curData, curPath, depth) => {
			if (depth === keyPaths.length) {
				expandedPaths.push(curPath);
				return;
			}
			const key = keyPaths[depth];
			if (depth === 0) {
				if (hasChildNodes(curData, dataIterator) && (key === DEFAULT_ROOT_PATH || key === WILDCARD)) populatePaths(curData, DEFAULT_ROOT_PATH, depth + 1);
			} else if (key === WILDCARD) {
				for (const { name, data: data2 } of dataIterator(curData)) if (hasChildNodes(data2, dataIterator)) populatePaths(data2, `${curPath}.${name}`, depth + 1);
			} else {
				const value = curData[key];
				if (hasChildNodes(value, dataIterator)) populatePaths(value, `${curPath}.${key}`, depth + 1);
			}
		};
		populatePaths(data, "", 0);
	});
	return expandedPaths.reduce((obj, path) => {
		obj[path] = true;
		return obj;
	}, { ...prevExpandedPaths });
};
var ConnectedTreeNode = memo((props) => {
	const { data, dataIterator, path, depth, nodeRenderer } = props;
	const [expandedPaths, setExpandedPaths] = useContext(ExpandedPathsContext);
	const nodeHasChildNodes = hasChildNodes(data, dataIterator);
	const expanded = !!expandedPaths[path];
	const handleClick = useCallback(() => nodeHasChildNodes && setExpandedPaths((prevExpandedPaths) => ({
		...prevExpandedPaths,
		[path]: !expanded
	})), [
		nodeHasChildNodes,
		setExpandedPaths,
		path,
		expanded
	]);
	return /* @__PURE__ */ React.createElement(TreeNode, {
		expanded,
		onClick: handleClick,
		shouldShowArrow: nodeHasChildNodes,
		shouldShowPlaceholder: depth > 0,
		nodeRenderer,
		...props
	}, expanded ? [...dataIterator(data)].map(({ name, data: data2, ...renderNodeProps }) => {
		return /* @__PURE__ */ React.createElement(ConnectedTreeNode, {
			name,
			data: data2,
			depth: depth + 1,
			path: `${path}.${name}`,
			key: name,
			dataIterator,
			nodeRenderer,
			...renderNodeProps
		});
	}) : null);
});
var TreeView = memo(({ name, data, dataIterator, nodeRenderer, expandPaths, expandLevel }) => {
	const styles = useStyles("TreeView");
	const stateAndSetter = useState({});
	const [, setExpandedPaths] = stateAndSetter;
	useLayoutEffect(() => setExpandedPaths((prevExpandedPaths) => getExpandedPaths(data, dataIterator, expandPaths, expandLevel, prevExpandedPaths)), [
		data,
		dataIterator,
		expandPaths,
		expandLevel
	]);
	return /* @__PURE__ */ React.createElement(ExpandedPathsContext.Provider, { value: stateAndSetter }, /* @__PURE__ */ React.createElement("ol", {
		role: "tree",
		style: styles.treeViewOutline
	}, /* @__PURE__ */ React.createElement(ConnectedTreeNode, {
		name,
		data,
		dataIterator,
		depth: 0,
		path: DEFAULT_ROOT_PATH,
		nodeRenderer
	})));
});
var ObjectName = ({ name, dimmed = false, styles = {} }) => {
	const themeStyles = useStyles("ObjectName");
	const appliedStyles = {
		...themeStyles.base,
		...dimmed ? themeStyles["dimmed"] : {},
		...styles
	};
	return /* @__PURE__ */ React.createElement("span", { style: appliedStyles }, name);
};
var ObjectValue = ({ object, styles }) => {
	const themeStyles = useStyles("ObjectValue");
	const mkStyle = (key) => ({
		...themeStyles[key],
		...styles
	});
	switch (typeof object) {
		case "bigint": return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueNumber") }, String(object), "n");
		case "number": return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueNumber") }, String(object));
		case "string": return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueString") }, "\"", object, "\"");
		case "boolean": return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueBoolean") }, String(object));
		case "undefined": return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueUndefined") }, "undefined");
		case "object":
			if (object === null) return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueNull") }, "null");
			if (object instanceof Date) return /* @__PURE__ */ React.createElement("span", null, object.toString());
			if (object instanceof RegExp) return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueRegExp") }, object.toString());
			if (Array.isArray(object)) return /* @__PURE__ */ React.createElement("span", null, `Array(${object.length})`);
			if (!object.constructor) return /* @__PURE__ */ React.createElement("span", null, "Object");
			if (typeof object.constructor.isBuffer === "function" && object.constructor.isBuffer(object)) return /* @__PURE__ */ React.createElement("span", null, `Buffer[${object.length}]`);
			return /* @__PURE__ */ React.createElement("span", null, object.constructor.name);
		case "function": return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueFunctionPrefix") }, "ƒ\xA0"), /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueFunctionName") }, object.name, "()"));
		case "symbol": return /* @__PURE__ */ React.createElement("span", { style: mkStyle("objectValueSymbol") }, object.toString());
		default: return /* @__PURE__ */ React.createElement("span", null);
	}
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
function getPropertyValue(object, propertyName) {
	const propertyDescriptor = Object.getOwnPropertyDescriptor(object, propertyName);
	if (propertyDescriptor.get) try {
		return propertyDescriptor.get();
	} catch {
		return propertyDescriptor.get;
	}
	return object[propertyName];
}
function intersperse(arr, sep) {
	if (arr.length === 0) return [];
	return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
}
var ObjectPreview = ({ data }) => {
	const styles = useStyles("ObjectPreview");
	const object = data;
	if (typeof object !== "object" || object === null || object instanceof Date || object instanceof RegExp) return /* @__PURE__ */ React.createElement(ObjectValue, { object });
	if (Array.isArray(object)) {
		const maxProperties = styles.arrayMaxProperties;
		const previewArray = object.slice(0, maxProperties).map((element, index) => /* @__PURE__ */ React.createElement(ObjectValue, {
			key: index,
			object: element
		}));
		if (object.length > maxProperties) previewArray.push(/* @__PURE__ */ React.createElement("span", { key: "ellipsis" }, "…"));
		const arrayLength = object.length;
		return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: styles.objectDescription }, arrayLength === 0 ? `` : `(${arrayLength})\xA0`), /* @__PURE__ */ React.createElement("span", { style: styles.preview }, "[", intersperse(previewArray, ", "), "]"));
	} else {
		const maxProperties = styles.objectMaxProperties;
		const propertyNodes = [];
		for (const propertyName in object) if (hasOwnProperty.call(object, propertyName)) {
			let ellipsis;
			if (propertyNodes.length === maxProperties - 1 && Object.keys(object).length > maxProperties) ellipsis = /* @__PURE__ */ React.createElement("span", { key: "ellipsis" }, "…");
			const propertyValue = getPropertyValue(object, propertyName);
			propertyNodes.push(/* @__PURE__ */ React.createElement("span", { key: propertyName }, /* @__PURE__ */ React.createElement(ObjectName, { name: propertyName || `""` }), ":\xA0", /* @__PURE__ */ React.createElement(ObjectValue, { object: propertyValue }), ellipsis));
			if (ellipsis) break;
		}
		const objectConstructorName = object.constructor ? object.constructor.name : "Object";
		return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: styles.objectDescription }, objectConstructorName === "Object" ? "" : `${objectConstructorName} `), /* @__PURE__ */ React.createElement("span", { style: styles.preview }, "{", intersperse(propertyNodes, ", "), "}"));
	}
};
var ObjectRootLabel = ({ name, data }) => {
	if (typeof name === "string") return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(ObjectName, { name }), /* @__PURE__ */ React.createElement("span", null, ": "), /* @__PURE__ */ React.createElement(ObjectPreview, { data }));
	else return /* @__PURE__ */ React.createElement(ObjectPreview, { data });
};
var ObjectLabel = ({ name, data, isNonenumerable = false }) => {
	const object = data;
	return /* @__PURE__ */ React.createElement("span", null, typeof name === "string" ? /* @__PURE__ */ React.createElement(ObjectName, {
		name,
		dimmed: isNonenumerable
	}) : /* @__PURE__ */ React.createElement(ObjectPreview, { data: name }), /* @__PURE__ */ React.createElement("span", null, ": "), /* @__PURE__ */ React.createElement(ObjectValue, { object }));
};
var createIterator = (showNonenumerable, sortObjectKeys) => {
	const objectIterator = function* (data) {
		if (!(typeof data === "object" && data !== null || typeof data === "function")) return;
		const dataIsArray = Array.isArray(data);
		if (!dataIsArray && data[Symbol.iterator]) {
			let i = 0;
			for (const entry of data) {
				if (Array.isArray(entry) && entry.length === 2) {
					const [k, v] = entry;
					yield {
						name: k,
						data: v
					};
				} else yield {
					name: i.toString(),
					data: entry
				};
				i++;
			}
		} else {
			const keys = Object.getOwnPropertyNames(data);
			if (sortObjectKeys === true && !dataIsArray) keys.sort();
			else if (typeof sortObjectKeys === "function") keys.sort(sortObjectKeys);
			for (const propertyName of keys) if (propertyIsEnumerable.call(data, propertyName)) {
				const propertyValue = getPropertyValue(data, propertyName);
				yield {
					name: propertyName || `""`,
					data: propertyValue
				};
			} else if (showNonenumerable) {
				let propertyValue;
				try {
					propertyValue = getPropertyValue(data, propertyName);
				} catch (e) {}
				if (propertyValue !== void 0) yield {
					name: propertyName,
					data: propertyValue,
					isNonenumerable: true
				};
			}
			if (showNonenumerable && data !== Object.prototype) yield {
				name: "__proto__",
				data: Object.getPrototypeOf(data),
				isNonenumerable: true
			};
		}
	};
	return objectIterator;
};
var defaultNodeRenderer = ({ depth, name, data, isNonenumerable }) => depth === 0 ? /* @__PURE__ */ React.createElement(ObjectRootLabel, {
	name,
	data
}) : /* @__PURE__ */ React.createElement(ObjectLabel, {
	name,
	data,
	isNonenumerable
});
var ObjectInspector = ({ showNonenumerable = false, sortObjectKeys, nodeRenderer, ...treeViewProps }) => {
	const dataIterator = createIterator(showNonenumerable, sortObjectKeys);
	const renderer = nodeRenderer ? nodeRenderer : defaultNodeRenderer;
	return /* @__PURE__ */ React.createElement(TreeView, {
		nodeRenderer: renderer,
		dataIterator,
		...treeViewProps
	});
};
var themedObjectInspector = themeAcceptor(ObjectInspector);
__toESM(require_is_dom(), 1);
//#endregion
//#region vendor/ipld-explorer-components/src/components/object-info/links-table.module.css
var links_table_module_default = {
	"links-table": "_links-table_vhd6s_1",
	"header-grid": "_header-grid_vhd6s_6",
	"row-grid": "_row-grid_vhd6s_7",
	"grid-cell-header": "_grid-cell-header_vhd6s_39",
	"grid-cell-row": "_grid-cell-row_vhd6s_40"
};
//#endregion
//#region vendor/ipld-explorer-components/src/components/object-info/links-table.tsx
var Row = ({ onLinkClick, startIndex, index, rowHeight, link }) => {
	const key = startIndex + index;
	const backgroundColor = key % 2 === 0 ? "#fff" : "rgb(251, 251, 251)";
	return /* @__PURE__ */ jsxs("div", {
		role: "button",
		tabIndex: 0,
		"aria-label": `${link.path} ${link.target}`,
		onKeyDown: (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				onLinkClick(link);
			}
		},
		className: `pv2 pointer items-center f7 ${links_table_module_default["row-grid"]} bb b--near-white`,
		style: {
			position: "absolute",
			top: key * rowHeight,
			width: "100%",
			backgroundColor
		},
		onClick: () => {
			onLinkClick(link);
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: `mid-gray tr pr1 f7 ${links_table_module_default["grid-cell-row"]} monospace}`,
				children: key
			}),
			/* @__PURE__ */ jsx("div", {
				className: `navy f6-ns f7 ${links_table_module_default["grid-cell-row"]}`,
				children: link.path
			}),
			/* @__PURE__ */ jsx("div", {
				className: `mid-gray tl ${links_table_module_default["grid-cell-row"]} ml1 f7 monospace}`,
				children: link.target
			})
		]
	}, key);
};
var Header = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: `mid-gray ${links_table_module_default["header-grid"]} items-center pv2 fw1 tracked bb b--near-white`,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: `mid-gray tr pr1 f7 ${links_table_module_default["grid-cell-header"]}`,
				children: "#"
			}),
			/* @__PURE__ */ jsx("div", {
				className: `navy tl tracked f7 ${links_table_module_default["grid-cell-header"]}`,
				children: "PATH"
			}),
			/* @__PURE__ */ jsx("div", {
				className: `mid-gray tl tracked ${links_table_module_default["grid-cell-header"]}`,
				children: "CID"
			})
		]
	});
};
var LargeLinksTable = ({ onLinkClick, links, rowHeight = 35, tableHeight = 650, cidRowStyle, maxRows = 50 }) => {
	const [startIndex, setStartIndex] = useState(0);
	const containerRef = useRef(null);
	const [tableWidth, setTableWidth] = useState(0);
	const handleScroll = useCallback((evt) => {
		evt.preventDefault();
		if (containerRef.current != null) {
			const scrollTop = containerRef.current.scrollTop;
			const newStartIndex = Math.floor(scrollTop / rowHeight);
			setStartIndex(newStartIndex);
		}
	}, [rowHeight]);
	const handleWindowResize = useCallback(() => {
		const container = containerRef.current;
		if (container != null) setTableWidth(container.clientWidth);
	}, []);
	useEffect(() => {
		const container = containerRef.current;
		if (container != null) {
			container.addEventListener("scroll", handleScroll);
			return () => {
				container.removeEventListener("scroll", handleScroll);
			};
		}
	}, [handleScroll]);
	useEffect(() => {
		handleWindowResize();
		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [handleWindowResize, containerRef.current?.clientWidth]);
	const endIndex = Math.min(startIndex + maxRows, links.length);
	const visibleLinks = links.slice(startIndex, endIndex);
	return /* @__PURE__ */ jsxs("div", {
		className: `collapse br2 pv2 ph3 mv2 nl3 nr3 mh0-l f7 ${links_table_module_default["links-table"]}`,
		children: [/* @__PURE__ */ jsx(Header, { cidRowStyle: cidRowStyle ?? { width: tableWidth } }), /* @__PURE__ */ jsx("div", {
			ref: containerRef,
			style: {
				height: tableHeight,
				overflowY: "auto",
				overflowX: "hidden",
				position: "relative"
			},
			children: /* @__PURE__ */ jsx("div", {
				style: {
					width: tableWidth,
					height: links.length * rowHeight
				},
				children: visibleLinks.map((link, index) => /* @__PURE__ */ jsx(Row, {
					onLinkClick,
					link,
					index,
					startIndex,
					rowHeight,
					cidRowStyle: cidRowStyle ?? {}
				}, startIndex + index))
			})
		})]
	});
};
//#endregion
//#region vendor/ipld-explorer-components/src/components/object-info/keyboard-inspector.tsx
function KeyboardInspector({ children, label }) {
	const focus = (item) => {
		if (!item) return;
		item.tabIndex = -1;
		item.focus();
	};
	const onKeyDown = (event) => {
		if (![
			"ArrowDown",
			"ArrowUp",
			"ArrowRight",
			"ArrowLeft",
			"Home",
			"End",
			"Enter",
			" "
		].includes(event.key)) return;
		const items = Array.from(event.currentTarget.querySelectorAll("[role=\"treeitem\"]"));
		const item = event.target.closest("[role=\"treeitem\"]") ?? items[0];
		if (!item) return;
		event.preventDefault();
		event.stopPropagation();
		const index = items.indexOf(item);
		if (event.key === "ArrowDown") focus(items[Math.min(index + 1, items.length - 1)]);
		else if (event.key === "ArrowUp") focus(items[Math.max(index - 1, 0)]);
		else if (event.key === "Home") focus(items[0]);
		else if (event.key === "End") focus(items.at(-1));
		else if (event.key === "Enter" || event.key === " ") item.firstElementChild?.click();
		else if (event.key === "ArrowRight") {
			if (item.getAttribute("aria-expanded") === "false") item.firstElementChild?.click();
			else focus(item.querySelector("[role=\"treeitem\"]"));
		} else if (item.getAttribute("aria-expanded") === "true") item.firstElementChild?.click();
		else focus(item.parentElement?.closest("[role=\"treeitem\"]"));
	};
	return /* @__PURE__ */ jsx("div", {
		role: "group",
		"aria-label": label,
		tabIndex: 0,
		onKeyDown,
		onFocus: (event) => {
			if (event.target === event.currentTarget) focus(event.currentTarget.querySelector("[role=\"treeitem\"]"));
		},
		children
	});
}
//#endregion
//#region vendor/ipld-explorer-components/src/components/object-info/ObjectInfo.tsx
var humansize = partial({ round: 0 });
var objectInspectorTheme = {
	...theme2,
	BASE_FONT_FAMILY: "Consolas, Menlo, monospace",
	TREENODE_FONT_FAMILY: "Consolas, Menlo, monospace",
	BASE_FONT_SIZE: "13px",
	BASE_LINE_HEIGHT: "19px",
	TREENODE_FONT_SIZE: "13px",
	TREENODE_LINE_HEIGHT: "19px"
};
var nodeStyles = {
	"dag-cbor": {
		shortName: "DAG-CBOR",
		name: "dag-cbor",
		color: theme.colors.aqua
	},
	"dag-json": {
		shortName: "DAG-JSON",
		name: "dag-json",
		color: theme.colors.green
	},
	raw: {
		shortName: "RAW",
		name: "Raw Block",
		color: theme.colors.red
	},
	"dag-pb": {
		shortName: "DAG-PB",
		name: "dag-pb",
		color: theme.colors.teal
	},
	"dag-jose": {
		shortName: "DAG-JOSE",
		name: "dag-jose",
		color: theme.colors.yellow
	},
	json: {
		shortName: "JSON",
		name: "JSON",
		color: theme.colors["green-muted"]
	},
	"hamt-sharded-directory": {
		shortName: "HAMT\nDAG-PB",
		name: "HAMT-Sharded dag-pb Directory",
		color: theme.colors["teal-muted"]
	},
	"eth-block": {
		shortName: "ETH",
		name: "Ethereum Block",
		color: theme.colors.charcoal
	},
	"eth-block-list": {
		shortName: "ETH",
		name: "Ethereum Block List",
		color: theme.colors.charcoal
	},
	"eth-tx-trie": {
		shortName: "ETH",
		name: "Ethereum Tx Trie",
		color: theme.colors.charcoal
	},
	"eth-tx": {
		shortName: "ETH",
		name: "Ethereum Tx",
		color: theme.colors.charcoal
	},
	"eth-state-trie": {
		shortName: "ETH",
		name: "Ethereum State Trie",
		color: theme.colors.charcoal
	},
	unknown: {
		shortName: "DAG",
		name: "DAG Node",
		color: theme.colors.red
	}
};
function shortNameForNode(type = "unknown") {
	return nodeStyles[type]?.shortName ?? "DAG";
}
function nameForNode(type = "unknown") {
	return nodeStyles[type]?.name ?? "DAG Node";
}
function colorForNode(type = "unknown") {
	return nodeStyles[type]?.color ?? "#ea5037";
}
function toExpandPathsNotation(localPath) {
	if (localPath == null) return [];
	const parts = localPath.split("/");
	const expandPaths = parts.map((part, i) => {
		if (part == null) return "$";
		return `$${parts.slice(0, i).join(".")}.${part}`;
	});
	return expandPaths.slice(0, expandPaths.length - 1);
}
var DagNodeIcon = ({ type, ...props }) => /* @__PURE__ */ jsx("svg", {
	...props,
	"data-title": nameForNode(type),
	width: "30",
	height: "30",
	viewBox: "0 0 30 30",
	xmlns: "http://www.w3.org/2000/svg",
	children: /* @__PURE__ */ jsx("circle", {
		cx: "15",
		cy: "15",
		r: "15",
		fillRule: "evenodd",
		fill: colorForNode(type)
	})
});
/**
* replace bigint or other non-JSON-serializable values with appropriate values for the react-inspector
* Note that data for some blocks (e.g. bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq) currently do not
* look like NormalizedDagNode['data']
*/
var getObjectInspectorData = (data) => {
	if (data == null || data instanceof Uint8Array || data.blockSizes == null) return data;
	return {
		...data,
		blockSizes: data.blockSizes.map(Number)
	};
};
var ObjectInfo = ({ className, type, cid, localPath, size, data, links, format, onLinkClick, gatewayUrl, publicGatewayUrl, ...props }) => {
	const { t, ready: tReady } = useTranslation("explore");
	if (!tReady) return null;
	const isUnixFs = format === "unixfs" && !(data instanceof Uint8Array) && data?.type != null && ["directory", "file"].some((x) => x === data.type);
	let nodeStyleType = type;
	if (isUnixFs || nameForNode(nodeStyleType) === "DAG Node") nodeStyleType = getCodecNameFromCode(CID.parse(cid).code) ?? type;
	return /* @__PURE__ */ jsxs("section", {
		className: `pa4 sans-serif ${className}`,
		...props,
		children: [
			/* @__PURE__ */ jsxs("h2", {
				className: "ma0 lh-title f4 fw4 montserrat pb2",
				title: nodeStyleType,
				children: [
					/* @__PURE__ */ jsx(DagNodeIcon, {
						type: nodeStyleType,
						className: "mr3",
						style: { verticalAlign: -8 }
					}),
					/* @__PURE__ */ jsx("span", {
						className: "v-mid",
						children: nameForNode(nodeStyleType)
					}),
					format === "unixfs" ? /* @__PURE__ */ jsx("a", {
						className: "dn di-ns no-underline charcoal ml2",
						href: "https://docs.ipfs.io/concepts/glossary/#unixfs",
						rel: "external",
						target: "_external",
						children: "UnixFS"
					}) : null,
					isUnixFs ? /* @__PURE__ */ jsxs("span", {
						className: "dib",
						children: [gatewayUrl != null && gatewayUrl !== publicGatewayUrl && /* @__PURE__ */ jsx("a", {
							className: "no-underline avenir ml2 pa2 fw5 f6 navy dib",
							href: `${gatewayUrl}/ipfs/${cid}`,
							rel: "external nofollow",
							target: "_external",
							children: t("ObjectInfo.privateGateway")
						}), publicGatewayUrl != null && /* @__PURE__ */ jsx("a", {
							className: "no-underline avenir ml2 pa2 fw5 f6 navy dib",
							href: `${publicGatewayUrl}/ipfs/${cid}`,
							rel: "external nofollow",
							target: "_external",
							children: t("ObjectInfo.publicGateway")
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "f6",
				children: [
					cid == null ? null : /* @__PURE__ */ jsxs("div", {
						className: "dt dt--fixed pt2",
						children: [/* @__PURE__ */ jsx("label", {
							className: "dtc silver tracked ttu f7",
							style: { width: 48 },
							children: "CID"
						}), /* @__PURE__ */ jsx("div", {
							className: "dtc truncate charcoal monospace",
							"data-id": "ObjectInfo-cid",
							children: cid
						})]
					}),
					size == null ? null : /* @__PURE__ */ jsxs("div", {
						className: "dt dt--fixed pt2",
						children: [/* @__PURE__ */ jsx("label", {
							className: "dtc silver tracked ttu f7",
							style: { width: 48 },
							children: "Size"
						}), /* @__PURE__ */ jsx("div", {
							className: "dtc truncate charcoal monospace",
							children: humansize(Number(size))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "dt dt--fixed pt2",
						children: [/* @__PURE__ */ jsx("label", {
							className: "dtc silver tracked ttu f7",
							style: { width: 48 },
							children: "Links"
						}), /* @__PURE__ */ jsx("div", {
							className: "dtc truncate charcoal",
							children: links != null ? /* @__PURE__ */ jsx("code", { children: links.length }) : "No Links"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "dt dt--fixed pt2",
						style: { height: 26 },
						children: [/* @__PURE__ */ jsx("label", {
							className: "dtc silver tracked ttu f7 v-mid",
							style: { width: 48 },
							children: "Data"
						}), /* @__PURE__ */ jsx("div", {
							className: "dtc truncate mid-gray",
							children: data != null ? null : "No data"
						})]
					}),
					data == null ? null : /* @__PURE__ */ jsx("div", {
						className: "pa3 mt2 bg-white f5 nl3 nr3 mh0-l overflow-x-auto",
						children: /* @__PURE__ */ jsx(KeyboardInspector, {
							label: cid,
							children: /* @__PURE__ */ jsx(themedObjectInspector, {
								showMaxKeys: 100,
								data: getObjectInspectorData(data),
								theme: objectInspectorTheme,
								expandPaths: toExpandPathsNotation(localPath)
							})
						})
					})
				]
			}),
			links?.length == null || links.length === 0 ? null : /* @__PURE__ */ jsx("div", {
				className: "mv2 nl3 nr3 mh0-l",
				children: /* @__PURE__ */ jsx(LargeLinksTable, {
					links,
					onLinkClick
				})
			})
		]
	});
};
//#endregion
//#region vendor/ipld-explorer-components/src/lib/explore-page-suggestions.ts
var explorePageLinks = [
	{
		name: "Project Apollo Archives",
		cid: "QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D",
		type: "dag-pb"
	},
	{
		name: "XKCD Archives",
		cid: "QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm",
		type: "dag-pb"
	},
	{
		name: "HAMT-sharded Wikipedia mirror (>20M files)",
		cid: "bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze",
		type: "hamt-sharded-directory"
	},
	{
		name: "B-tree search index from ipfs-geoip",
		cid: "bafyreif3tfdpr5n4jdrbielmcapwvbpcthepfkwq2vwonmlhirbjmotedi",
		type: "dag-cbor"
	},
	{
		name: "DAG-CBOR Block",
		cid: "bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq",
		type: "dag-cbor"
	},
	{
		name: "dag-cbor hello world (keccak-256)",
		cid: "bafyrwigbexamue2ba3hmtai7hwlcmd6ekiqsduyf5avv7oz6ln3radvjde",
		type: "dag-cbor"
	},
	{
		name: "Ceramic LogEntry for sgb.chat Ambassador proposal",
		cid: "bagcqcerarvdwmhvk73mze3e2n6yvpt5h7fh3eae7n6y3hizsflz5grpyeczq",
		type: "dag-jose"
	},
	{
		name: "hello world (blake3)",
		cid: "bagaaihraf4oq2kddg6o5ewlu6aol6xab75xkwbgzx2dlot7cdun7iirve23a",
		type: "dag-json"
	},
	{
		name: "hello world",
		cid: "baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea",
		type: "dag-json"
	},
	{
		name: "hello world (sha3-512)",
		cid: "bagaaifcavabu6fzheerrmtxbbwv7jjhc3kaldmm7lbnvfopyrthcvod4m6ygpj3unrcggkzhvcwv5wnhc5ufkgzlsji7agnmofovc2g4a3ui7ja",
		type: "json"
	},
	{
		name: "Raw Block for \"hello\"",
		cid: "bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq",
		type: "raw"
	},
	{
		name: "Raw Block for \"hello\" (blake3)",
		cid: "bafkr4ihkr4ld3m4gqkjf4reryxsy2s5tkbxprqkow6fin2iiyvreuzzab4",
		type: "raw"
	}
];
//#endregion
//#region vendor/ipld-explorer-components/src/lib/tours.tsx
var projectsTour = {
	getSteps: ({ t }) => [{
		content: /* @__PURE__ */ jsxs("div", {
			className: "montserrat charcoal",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "f3 fw4",
				children: t("tour.projects.title")
			}), /* @__PURE__ */ jsx("p", {
				className: "tl f6",
				children: t("tour.projects.paragraph1")
			})]
		}),
		placement: "center",
		target: "body"
	}],
	options: {
		width: "500px",
		primaryColor: "#69c4cd",
		textColor: "#34373f",
		zIndex: 999
	}
};
var explorerTour = {
	getSteps: ({ t }) => [
		{
			content: /* @__PURE__ */ jsxs("div", {
				className: "montserrat charcoal",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "f3 fw4",
					children: t("tour.explorer.step1.title")
				}), /* @__PURE__ */ jsx("p", {
					className: "tl f6",
					children: t("tour.explorer.step1.paragraph1")
				})]
			}),
			placement: "center",
			target: "body"
		},
		{
			content: /* @__PURE__ */ jsxs("div", {
				className: "montserrat charcoal",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "f3 fw4",
						children: t("tour.explorer.step2.title")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "tl f6",
						children: t("tour.explorer.step2.paragraph1")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "tl f6",
						children: t("tour.explorer.step2.paragraph2")
					})
				]
			}),
			placement: "bottom",
			target: ".joyride-explorer-crumbs"
		},
		{
			content: /* @__PURE__ */ jsxs("div", {
				className: "montserrat charcoal",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "f3 fw4",
					children: t("tour.explorer.step3.title")
				}), /* @__PURE__ */ jsx("p", {
					className: "tl f6",
					children: t("tour.explorer.step3.paragraph1")
				})]
			}),
			placement: "right",
			target: ".joyride-explorer-node"
		},
		{
			content: /* @__PURE__ */ jsxs("div", {
				className: "montserrat charcoal",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "f3 fw4",
					children: t("tour.explorer.step4.title")
				}), /* @__PURE__ */ jsx("p", {
					className: "tl f6",
					children: t("tour.explorer.step4.paragraph1")
				})]
			}),
			placement: "left",
			target: ".joyride-explorer-cid"
		},
		{
			content: /* @__PURE__ */ jsxs("div", {
				className: "montserrat charcoal",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "f3 fw4",
					children: t("tour.explorer.step5.title")
				}), /* @__PURE__ */ jsx("p", {
					className: "tl f6",
					children: t("tour.explorer.step5.paragraph1")
				})]
			}),
			locale: { last: "Finish" },
			placement: "left",
			target: ".joyride-explorer-graph"
		}
	],
	options: {
		width: "500px",
		primaryColor: "#69c4cd",
		textColor: "#34373f",
		zIndex: 999
	}
};
//#endregion
//#region vendor/ipld-explorer-components/src/icons/GlyphSmallCancel.tsx
var GlyphSmallCancel = (props) => /* @__PURE__ */ jsx("svg", {
	viewBox: "0 0 100 100",
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M63.79 63.2l-3.88 3.88-9.71-9.7-9.7 9.7-3.88-3.88 9.7-9.71-9.7-9.7 3.88-3.88 9.7 9.7 9.71-9.7 3.88 3.88-9.7 9.7 9.7 9.71z" })
});
//#endregion
//#region vendor/ipld-explorer-components/src/components/error/ErrorBoundary.tsx
var ErrorBoundary = class extends React.Component {
	state = { hasError: false };
	static defaultProps = { fallback: GlyphSmallCancel };
	componentDidCatch(error, _info) {
		this.setState({ hasError: true });
		console.error(error);
	}
	render() {
		const { hasError } = this.state;
		const { children, fallback: Fallback } = this.props;
		return hasError ? /* @__PURE__ */ jsx(Fallback, {}) : children;
	}
};
//#endregion
//#region vendor/ipld-explorer-components/src/components/box/Box.tsx
var Box = ({ className = "pa4", style, children }) => {
	return /* @__PURE__ */ jsx("div", {
		className,
		style: {
			background: "#fbfbfb",
			...style
		},
		children: /* @__PURE__ */ jsx(ErrorBoundary, { children })
	});
};
//#endregion
//#region vendor/ipld-explorer-components/src/components/about/ipld.svg
var ipld_default = "data:image/svg+xml,%3csvg%20width='134'%20height='81'%20viewBox='0%200%20134%2081'%20xmlns='http://www.w3.org/2000/svg'%3e%3ctitle%3elogotype_IPLD%3c/title%3e%3cg%20fill='none'%3e%3cpath%20d='M70.638%2058.696V21.994c0-1.25-.667-2.405-1.75-3.03L37.103.613a3.499%203.499%200%200%200-3.498%200L1.82%2018.963a3.498%203.498%200%200%200-1.75%203.03v36.703c0%201.25.667%202.405%201.75%203.03l31.785%2018.35a3.499%203.499%200%200%200%203.498%200l31.785-18.35a3.498%203.498%200%200%200%201.75-3.03z'%20fill='%231D74F2'/%3e%3cg%20transform='translate(3.754%204.692)'%20fill='%23FFF'%3e%3cpath%20d='M31.6%2070.24L1.23%2052.455V19.034L31.6%201.066l.043.024L61.97%2018.317v34.139l-.043.025L31.6%2070.239zM1.402%2052.356L31.6%2070.039l30.198-17.682v-33.94L31.6%201.266%201.402%2019.132v33.225z'/%3e%3cpath%20d='M30.909%2010.953h1.382v59.186h-1.382z'/%3e%3ccircle%20cx='31.6'%20cy='11.068'%20r='2.175'/%3e%3cpath%20d='M30.939%2027.127l-6.642-4.196v-8.048h1.382v7.287l5.998%203.789z'/%3e%3cg%20transform='translate(31.346%2032.284)'%3e%3cpath%20d='M.784%2022.438L.046%2021.27l22.73-14.36V3.77h1.383v3.903z'/%3e%3ccircle%20cx='23.468'%20cy='2.308'%20r='2.175'/%3e%3c/g%3e%3cpath%20d='M42.357%2031.103h1.382v16.121h-1.382zM31.086%2043.632L14.26%2034.383V27.01h1.382v6.58l16.139%208.848z'/%3e%3ccircle%20cx='14.951'%20cy='26.396'%20r='2.175'/%3e%3ccircle%20cx='24.988'%20cy='16.52'%20r='2.175'/%3e%3cg%20transform='translate(31.158%2022.149)'%3e%3cpath%20d='M14.308%203.784v3.143L.124%2015.887c.011.533.03%201.068.049%201.603L15.69%207.688V3.785h-1.382z'/%3e%3ccircle%20cx='14.999'%20cy='2.323'%20r='2.175'/%3e%3c/g%3e%3cpath%20d='M32.08%2031.103l6.641-4.195v-8.049H37.34v7.287l-5.998%203.789z'/%3e%3ccircle%20cx='38.03'%20cy='18.859'%20r='2.175'/%3e%3ccircle%20cx='24.657'%20cy='30.397'%20r='2.175'/%3e%3cpath%20d='M23.966%2030.917h1.382v8.687h-1.382z'/%3e%3cg%20transform='translate(6.194%2034.537)'%3e%3cpath%20d='M25.031%2020.367l.739-1.168L3.038%206.804V3.662H1.656v3.904z'/%3e%3ccircle%20cx='2.347'%20cy='2.201'%20r='2.175'/%3e%3c/g%3e%3cpath%20d='M16.78%2035.652h1.238v11.171H16.78z'/%3e%3ccircle%20cx='31.6'%20cy='69.912'%20r='1.213'/%3e%3cg%20transform='translate(0%2018.02)'%3e%3ccircle%20cx='1.23'%20cy='34.437'%20r='1.213'/%3e%3ccircle%20cx='1.23'%20cy='1.351'%20r='1.213'/%3e%3c/g%3e%3cg%20transform='translate(60.627%2018.02)'%3e%3ccircle%20cx='1.343'%20cy='34.359'%20r='1.213'/%3e%3ccircle%20cx='1.343'%20cy='1.273'%20r='1.213'/%3e%3c/g%3e%3ccircle%20cx='31.599'%20cy='1.393'%20r='1.213'/%3e%3c/g%3e%3cpath%20d='M83.893%2024.094v31.21h-3.478v-31.21zm10.387%200c4.905%200%207%202.898%207%207.624v3.745c0%204.949-2.318%207.535-7.267%207.535h-3.076v12.305h-3.478v-31.21h6.822zm-.267%2015.783c2.586%200%203.835-1.204%203.835-4.191v-4.147c0-2.853-1.026-4.28-3.567-4.28h-3.344v12.618h3.076zm10.121%2015.426v-31.21h3.478v28.045h8.917v3.165h-12.395zm22.337-31.209c4.86%200%207.09%202.942%207.09%207.758V47.59c0%204.77-2.23%207.713-7.09%207.713h-7.312v-31.21h7.312zm-.044%2028.044c2.497%200%203.7-1.56%203.7-4.414V31.673c0-2.853-1.203-4.414-3.745-4.414h-3.745v24.878h3.79z'%20fill='%231D74F2'/%3e%3c/g%3e%3c/svg%3e";
//#endregion
//#region vendor/ipld-explorer-components/src/components/about/AboutIpld.tsx
var AboutIpld = () => {
	const { t } = useTranslation("explore");
	return /* @__PURE__ */ jsxs(Box, {
		className: "tl dib pa4 avenir measure-wide-l lh-copy dark-gray ba-l b--black-10",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "tc",
				children: /* @__PURE__ */ jsx("a", {
					className: "link",
					href: "https://ipld.io",
					children: /* @__PURE__ */ jsx("img", {
						src: ipld_default,
						alt: "IPLD",
						style: { height: 60 }
					})
				})
			}),
			/* @__PURE__ */ jsx(Trans, {
				i18nKey: "AboutIpld.paragraph1",
				t,
				children: /* @__PURE__ */ jsxs("p", { children: [
					"IPLD is ",
					/* @__PURE__ */ jsx("strong", { children: "the data model of the content-addressable web." }),
					" It allows us to treat all hash-linked data structures as subsets of a unified information space, unifying all data models that link data with hashes as instances of IPLD."
				] })
			}),
			/* @__PURE__ */ jsx(Trans, {
				i18nKey: "AboutIpld.paragraph2",
				t,
				children: /* @__PURE__ */ jsx("p", { children: "Content addressing through hashes has become a widely-used means of connecting data in distributed systems, from the blockchains that run your favorite cryptocurrencies, to the commits that back your code, to the web’s content at large. Yet, whilst all of these tools rely on some common primitives, their specific underlying data structures are not interoperable." })
			}),
			/* @__PURE__ */ jsx(Trans, {
				i18nKey: "AboutIpld.paragraph3",
				t,
				children: /* @__PURE__ */ jsx("p", { children: "Enter IPLD: a single namespace for all hash-inspired protocols. Through IPLD, links can be traversed across protocols, allowing you to explore data regardless of the underlying protocol." })
			})
		]
	});
};
//#endregion
//#region vendor/ipld-explorer-components/src/components/StartExploringPage.tsx
var ExploreSuggestion = ({ cid, name, type }) => /* @__PURE__ */ jsxs("a", {
	className: "flex items-center lh-copy pl3 pl0-l pv3 bb b--black-10 link focus-outline",
	href: `#/explore/${cid}`,
	children: [/* @__PURE__ */ jsx("span", {
		className: "flex items-center justify-center w3 h3 w3-m h3-m w3-l h3-l flex-none br-100 tc",
		style: { background: colorForNode(type) },
		children: /* @__PURE__ */ jsx("span", {
			className: "montserrat fw3 f6 snow",
			title: nameForNode(type),
			children: shortNameForNode(type)
		})
	}), /* @__PURE__ */ jsxs("span", {
		className: "pl3 truncate",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "ma0 fw4 f5 db black montserrat",
			children: name
		}), /* @__PURE__ */ jsx("span", {
			className: "f7 db blue truncate monospace",
			children: cid
		})]
	})]
});
var StartExploringPage = ({ embed, runTour = false, joyrideCallback, links }) => {
	const { t } = useTranslation("explore");
	return /* @__PURE__ */ jsxs("div", {
		className: "mw9 center explore-sug-2",
		children: [
			/* @__PURE__ */ jsx("title", { children: t("StartExploringPage.title") }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-l",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-auto-l mr3-l",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "pl3 pl0-l pt4 pt2-l",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "f3 f2-l ma0 fw4 montserrat charcoal",
								children: t("StartExploringPage.header")
							}), /* @__PURE__ */ jsx("p", {
								className: "lh-copy f5 avenir charcoal-muted",
								children: t("StartExploringPage.leadParagraph")
							})]
						}),
						embed != null ? /* @__PURE__ */ jsx(IpldExploreForm, {}) : null,
						/* @__PURE__ */ jsx("ul", {
							className: "list pl0 ma0 mt4 mt0-l bt bn-l b--black-10",
							children: (links ?? explorePageLinks).map((suggestion) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(ExploreSuggestion, {
								name: suggestion.name,
								cid: suggestion.cid,
								type: suggestion.type
							}) }, suggestion.cid))
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "pt2-l",
					children: /* @__PURE__ */ jsx(AboutIpld, {})
				})]
			}),
			/* @__PURE__ */ jsx(Joyride, {
				run: runTour,
				steps: projectsTour.getSteps({ t }),
				options: projectsTour.options,
				onEvent: joyrideCallback,
				scrollToFirstStep: true
			})
		]
	});
};
//#endregion
export { ObjectInfo as a, explorerTour as i, Box as n, colorForNode as o, ErrorBoundary as r, StartExploringPage as t };
