import { ArconnectSigner, TurboFactory } from '@ardrive/turbo-sdk/web';
import { buildMemoryUploadTags } from '@/utils/memory-tags'

export async function uploadFileTurbo(file: File, api: any, tags: { name: string, value: string }[] = []) {
  const signer = new ArconnectSigner(api)
  console.log('signer', signer);

  const turbo = TurboFactory.authenticated({ signer })
  const res = await turbo.uploadFile({
    fileStreamFactory: () => file.stream(),
    fileSizeFactory: () => file.size,
    dataItemOpts: {
      tags: buildMemoryUploadTags(file, tags),
    }
  })
  return res.id;
}