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
  Pin
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
  const PromIcon = ({ size = DEFAULT_SIZE, strokeWidth = STROKE_WIDTH, ...props }) => (
    <LucideIcon size={size} strokeWidth={strokeWidth} aria-hidden='true' focusable='false' {...props} />
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
