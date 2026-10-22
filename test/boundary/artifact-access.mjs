// Metadata uses the full source-aware validator. Gateway publication remains a
// separate owned dependency and cannot poison an already verified metadata read.
export function createArtifactAccess ({ produce, verify, bind, publish }) {
  let metadataPromise, artifactPromise
  async function getMetadata () {
    metadataPromise ||= (async () => {
      await produce()
      const artifact = await verify()
      bind(artifact)
      return { manifest: artifact }
    })()
    return metadataPromise
  }
  async function getArtifact () {
    artifactPromise ||= (async () => {
      const { manifest } = await getMetadata()
      const baseURL = await publish(manifest)
      return { manifest, baseURL }
    })()
    return artifactPromise
  }
  return { getArtifact, getMetadata }
}
