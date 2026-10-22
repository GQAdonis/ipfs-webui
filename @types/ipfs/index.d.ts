declare module 'ipfs' {
  import type { CID } from 'multiformats/cid'
  import type { Multiaddr } from '@multiformats/multiaddr'
  import type { Buffer } from 'buffer'
  import type { KuboRPCClient } from 'kubo-rpc-client'

  export type UnixFSTime = {
    secs: number,
    nsecs: number
  }

  export type UnixFSEntry = {
    path: string,
    cid: CID,
    mode: number,
    mtime: UnixFSTime,
    size: number
  }

  type FileContent =
    | Uint8Array
    | Blob
    | String
    | AsyncIterable<Uint8Array>
    | ReadableStream<Uint8Array>

  export type FileType =
    | 'file'
    | 'directory'

  type FileObject = {
    path?: string,
    content?: FileContent,
    mode?: number | string,
    mtime?: Date | UnixFSTime | [number, number]
  }

  export type TimeoutOptions = {
    timeout?: number,
    signal?: AbortSignal
  }

  export type ListOptions = TimeoutOptions & {}

  export type CatOptions = TimeoutOptions & {
    offset?: number;
    length?: number;
  }

  type LoadProgress = {
    total: number,
    loaded: number,
    lengthComputable: boolean
  }

  export type AddOptions = TimeoutOptions & {
    chunker?: string,
    cidVersion?: number,
    hashAlg?: number,
    onlyHash?: boolean,
    pin?: boolean,
    progress?: (bytes: number, name:string) => void,
    rawLeaves?: boolean,
    trickle?: boolean,
    wrapWithDirectory?: boolean,
    onUploadProgress?: (progress: LoadProgress) => void,
    onDownloadProgress?: (progress: LoadProgress) => void
  }

    export type ListEntry = {
    depth: number,
    name: string,
    path: string,
    size: number,
    cid: CID,
    // IPFS is pretty inconsistent with type field see
    // https://github.com/ipfs/js-ipfs/issues/3229
    type: FileType | 'dir',
    mode: number,
    mtime: { secs: number, nsecs?: number }
  }

  export interface CoreService {
    // TODO: cat returns AsyncIterable<Uint8Array>. see https://github.com/ipfs/js-kubo-rpc-client/blob/1ab7941819dd1a48df653ee159e6983608e72132/src/index.ts#L353C50-L353C75
    cat(pathOrCID: string | CID, options?: CatOptions): AsyncIterable<Buffer>;
    ls(pathOrCID: string | CID, options?: ListOptions): AsyncIterable<ListEntry>;
    add(file: FileContent | FileObject, options?: AddOptions): Promise<UnixFSEntry>;
    addAll(files: Iterable<FileContent | FileObject> | AsyncIterable<FileContent | FileObject> | ReadableStream<FileContent | FileObject>, options?: AddOptions): AsyncIterable<UnixFSEntry>;
  }

  export type Pin = { cid: CID }

  export type PinType =
    | 'recursive'
    | 'direct'
    | 'indirect'

  export type PinEntry = {
    cid: CID,
    typ: PinType
  }

  export type PinListOptions = TimeoutOptions & {
    paths?: string | CID | string[] | CID[],
    type?: PinType
  }

  export type PinRemoveOptions = TimeoutOptions & {
    recursive?: boolean
  }

  export type PinAddOptions = TimeoutOptions & {
    recursive?: boolean,
  }

  export interface RemotePinServicesOptions {
    cid: CID[];
    service: string;
  }

  export interface RemotePinService {
    rm(options: RemotePinServicesOptions): Promise<boolean>;
  }

  export interface PinService {
    add(cid: CID, options?: PinAddOptions): Promise<Pin[]>;
    ls(options?: PinListOptions): AsyncIterable<PinEntry>;
    rm(cid: CID, options?: PinRemoveOptions): Promise<Pin[]>;
    remote: RemotePinService;
  }

  export type FSStatOptions = TimeoutOptions & {
    hash?: boolean,
    size?: boolean,
    withLocal?: boolean
  }

  export interface FileStat {
    cid: CID;
    size: number;
    cumulativeSize: number;
    type: FileType;
    blocks: number;
    withLocality: boolean;
    local: boolean;
    sizeLocal: number;
  }

  export type FSCopyOptions = TimeoutOptions & {
    parents?: boolean,
    flush?: boolean,
    hashAlg?: string,
    cidVersion?: number
  }

  export type FSMoveOptions = TimeoutOptions & {
    parents?: boolean,
    flush?: boolean,
    hashAlg?: string,
    cidVersion?: number
  }

  export type FSRemoveOptions = TimeoutOptions & {
    recursive?: boolean,
    flush?: boolean,
    hashAlg?: string,
    cidVersion?: number
  }

  export type FSMakDirectoryOptions = TimeoutOptions & {
    parents?: boolean,
    mode?: number,
    mtime?: UnixFSTime | Date | [number, number],
    flush?: boolean,
    hashAlg?: string,
    cidVersion?: number
  }

  export interface FileService {
    stat(path: string, options?: FSStatOptions): Promise<FileStat>;
    cp(from: string, to: string, options?: FSCopyOptions): Promise<void>;
    mv(from: string, to: string, options?: FSMoveOptions): Promise<void>;
    rm(path: string, options: FSRemoveOptions): Promise<void>;
    mkdir(path: string, options: FSMakDirectoryOptions): Promise<void>;
  }

  export type NameResloveOptions = TimeoutOptions & {
    recursive?: boolean,
    nocache?: boolean
  }

  export interface NameService {
    resolve(value: string, options?: NameResloveOptions): AsyncIterable<string>
  }

  export type ObjectNewOptions = TimeoutOptions & {
    template?: string,
    recursive?: boolean,
    nocache?: boolean
  }

  export type DAGLink = {
    name: string,
    size: number,
    cid: CID
  }

  export interface ObjectPatchService {
    addLink(cid: CID, link: DAGLink, options?: TimeoutOptions): Promise<CID>
  }

  export interface ObjectService {
    new: (options?: ObjectNewOptions) => Promise<CID>;
    patch: ObjectPatchService
  }

  export interface ConfigProfiles {
    list(options?: TimeoutOptions): Promise<Array<{ name: string, description: string }>>;
    apply(name: string, options?: { dryRun?: boolean } & TimeoutOptions): Promise<{ original: Object, updated: Object }>;
  }

  export interface ConfigService {
    get(key: string, options?: TimeoutOptions): Promise<Object>;
    getAll(options?: TimeoutOptions): Promise<Object>;
    set(key: string, value: string | number | null | boolean | Object, options?: TimeoutOptions): Promise<void>;
    replace(config: Object, options?: TimeoutOptions): Promise<void>;

    profiles: ConfigProfiles;
  }

  export interface IPFSService extends CoreService {
    pin: PinService;
    files: FileService;
    name: NameService;
    object: ObjectService;
    config: ConfigService;
    dag: KuboRPCClient['dag'];

    stop(options?: TimeoutOptions): Promise<void>
  }

  export interface SwarmService {
    connect(addr: Multiaddr, options?: TimeoutOptions): Promise<void>
  }

  export let IPFS: IPFSService
}
