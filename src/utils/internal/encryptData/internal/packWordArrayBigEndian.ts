export default function packWordArrayBigEndian(arr) {
  const result = new Uint8Array(arr.sigBytes)
  const view = new DataView(result.buffer);
  for (let i = 0 ; i < arr.words.length ; i++){
      view.setInt32(i * 4, arr.words[i], false)
  }
  return result
}