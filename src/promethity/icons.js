import React from 'react'
import {
  Gauge,
  Folder,
  Compass,
  Users,
  Settings,
  Activity,
  Check,
  Code,
  CircleCheck,
  TriangleAlert,
  CircleX,
  Info,
  ChevronDown,
  CircleHelp,
  Wifi,
  WifiOff,
  LoaderCircle,
  Search,
  Braces,
  Maximize2,
  Minimize2,
  Settings2,
  Play,
  Pause,
  ArrowDownToLine,
  Trash2,
  EllipsisVertical,
  Plus,
  FileText,
  FolderPlus,
  Link2,
  Database,
  Pin,
  X,
  Ellipsis,
  Pencil,
  Download,
  Megaphone,
  Cloud,
  ExternalLink,
  Copy,
  Share2,
  FlaskConical,
  Waypoints,
  Network,
  Globe,
  Box,
  File,
  FileVideo,
  FileSpreadsheet,
  FileAudio,
  FileImage,
  List,
  LayoutGrid
} from 'lucide-react'

// The fork's single icon module (webui-shell-redesign 1.3): nav and settings
// icons come from here and nowhere else. Lucide strokes at 1.5px in
// currentColor, 20px by default, per kubo DESIGN.md "Iconography" (16 or
// 20px, in `text` or `text-muted`). Colour is inherited, so an icon follows
// its label through muted → text → accent-text states with no per-icon CSS.
// Icons are decorative by default: the accessible name lives on the control
// or label beside them; pass aria-label/title through props when an icon
// stands alone.

const STROKE_WIDTH = 1.5
const DEFAULT_SIZE = 20

/**
 * @param {import('lucide-react').LucideIcon} LucideIcon
 * @param {string} displayName
 * @returns {React.FC<import('lucide-react').LucideProps>}
 */
const promIcon = (LucideIcon, displayName) => {
  /** @type {React.FC<import('lucide-react').LucideProps>} */
  const PromIcon = ({ size = DEFAULT_SIZE, strokeWidth = STROKE_WIDTH, className = '', ...props }) => (
    <LucideIcon size={size} strokeWidth={strokeWidth} className={`prom-icon ${className}`.trim()} aria-hidden='true' focusable='false' {...props} />
  )
  PromIcon.displayName = displayName
  return PromIcon
}

// Nav rail (NavBar.js)
export const StatusIcon = promIcon(Gauge, 'StatusIcon')
export const FilesIcon = promIcon(Folder, 'FilesIcon')
export const ExploreIcon = promIcon(Compass, 'ExploreIcon')
export const PeersIcon = promIcon(Users, 'PeersIcon')
export const SettingsIcon = promIcon(Settings, 'SettingsIcon')
export const DiagnosticsIcon = promIcon(Activity, 'DiagnosticsIcon')

// Settings page (SettingsPage.js)
export const CheckIcon = promIcon(Check, 'CheckIcon')
export const CodeIcon = promIcon(Code, 'CodeIcon')

// Settings primitives (src/promethity/components): state icons always sit
// beside a word, never alone (kubo DESIGN.md, Color: state is words first).
export const OkIcon = promIcon(CircleCheck, 'OkIcon')
export const WarnIcon = promIcon(TriangleAlert, 'WarnIcon')
export const ErrIcon = promIcon(CircleX, 'ErrIcon')
export const InfoIcon = promIcon(Info, 'InfoIcon')
export const ChevronDownIcon = promIcon(ChevronDown, 'ChevronDownIcon')

// Top bar (Connected, TourHelper, the CID form). The status icons always sit
// beside a state word (Connected.js), never alone.
export const HelpIcon = promIcon(CircleHelp, 'HelpIcon')
export const ConnectedIcon = promIcon(Wifi, 'ConnectedIcon')
export const DisconnectedIcon = promIcon(WifiOff, 'DisconnectedIcon')
export const ConnectingIcon = promIcon(LoaderCircle, 'ConnectingIcon')
export const BrowseIcon = promIcon(Folder, 'BrowseIcon')
export const InspectIcon = promIcon(Braces, 'InspectIcon')
export const SearchIcon = promIcon(Search, 'SearchIcon')

// Diagnostics log viewer controls (log-viewer.tsx)
export const ExpandIcon = promIcon(Maximize2, 'ExpandIcon')
export const CollapseIcon = promIcon(Minimize2, 'CollapseIcon')
export const ConfigureIcon = promIcon(Settings2, 'ConfigureIcon')
export const PlayIcon = promIcon(Play, 'PlayIcon')
export const PauseIcon = promIcon(Pause, 'PauseIcon')
export const ScrollLatestIcon = promIcon(ArrowDownToLine, 'ScrollLatestIcon')
export const ClearIcon = promIcon(Trash2, 'ClearIcon')

// Files toolbar (FileInput, Header)
export const MoreIcon = promIcon(EllipsisVertical, 'MoreIcon')
export const PlusIcon = promIcon(Plus, 'PlusIcon')
export const DocumentIcon = promIcon(FileText, 'DocumentIcon')
export const FolderIcon = promIcon(Folder, 'FolderIcon')
export const NewFolderIcon = promIcon(FolderPlus, 'NewFolderIcon')
export const AddByPathIcon = promIcon(Link2, 'AddByPathIcon')
export const CarFileIcon = promIcon(Database, 'CarFileIcon')
export const PinQueueIcon = promIcon(Pin, 'PinQueueIcon')

// Glyph replacements (webui-shell-redesign 1.4, M11). Call sites that used the
// upstream `Glyph*`/`Stroke*` SVG components (`src/icons/**`) now import these
// under the old local names, so their JSX is unchanged. The upstream glyphs
// were filled shapes coloured by Tachyons `fill-*` classes; Lucide icons are
// strokes, so `legacyIcon` pins `fill: none` (via `.prom-icon` in
// theme-overrides.css, which also maps the `fill-*` classes onto `color`) and
// drops the `viewBox`/`fill` props some call sites pass for the old artwork.

/**
 * @param {import('lucide-react').LucideIcon} LucideIcon
 * @param {string} displayName
 * @returns {React.FC<import('lucide-react').LucideProps>}
 */
const legacyIcon = (LucideIcon, displayName) => {
  /** @type {React.FC<import('lucide-react').LucideProps>} */
  const LegacyIcon = ({ size = DEFAULT_SIZE, strokeWidth = STROKE_WIDTH, className = '', viewBox: _viewBox, fill: _fill, ...props }) => (
    <LucideIcon size={size} strokeWidth={strokeWidth} className={`prom-icon ${className}`.trim()} aria-hidden='true' focusable='false' {...props} />
  )
  LegacyIcon.displayName = displayName
  return LegacyIcon
}

export const CloseIcon = legacyIcon(X, 'CloseIcon')
export const DotsIcon = legacyIcon(Ellipsis, 'DotsIcon')
export const PencilIcon = legacyIcon(Pencil, 'PencilIcon')
export const DownloadIcon = legacyIcon(Download, 'DownloadIcon')
export const PublishIcon = legacyIcon(Megaphone, 'PublishIcon')
export const TrashIcon = legacyIcon(Trash2, 'TrashIcon')
export const CloudIcon = legacyIcon(Cloud, 'CloudIcon')
export const PinCloudIcon = legacyIcon(Cloud, 'PinCloudIcon')
export const PinnedIcon = legacyIcon(Pin, 'PinnedIcon')
export const ExternalLinkIcon = legacyIcon(ExternalLink, 'ExternalLinkIcon')
export const CopyIcon = legacyIcon(Copy, 'CopyIcon')
export const ShareIcon = legacyIcon(Share2, 'ShareIcon')
export const LabIcon = legacyIcon(FlaskConical, 'LabIcon')
export const IpldIcon = legacyIcon(Waypoints, 'IpldIcon')
export const NetworkIcon = legacyIcon(Network, 'NetworkIcon')
export const GlobeIcon = legacyIcon(Globe, 'GlobeIcon')
export const CubeIcon = legacyIcon(Box, 'CubeIcon')
export const AttentionIcon = legacyIcon(TriangleAlert, 'AttentionIcon')
export const GenericFileIcon = legacyIcon(File, 'GenericFileIcon')
export const VideoFileIcon = legacyIcon(FileVideo, 'VideoFileIcon')
export const SpreadsheetFileIcon = legacyIcon(FileSpreadsheet, 'SpreadsheetFileIcon')
export const AudioFileIcon = legacyIcon(FileAudio, 'AudioFileIcon')
export const ImageFileIcon = legacyIcon(FileImage, 'ImageFileIcon')
export const TextFileIcon = legacyIcon(FileText, 'TextFileIcon')
export const ListViewIcon = legacyIcon(List, 'ListViewIcon')
export const GridViewIcon = legacyIcon(LayoutGrid, 'GridViewIcon')
export const ExpandChevronIcon = legacyIcon(ChevronDown, 'ExpandChevronIcon')
