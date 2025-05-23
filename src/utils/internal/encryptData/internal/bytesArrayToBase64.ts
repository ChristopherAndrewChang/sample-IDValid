import bytesArrayToString from './bytesArrayToString';
import stringToBase64 from './stringToBase64';

export default function bytesArrayToBase64(input, safe=false, removePadding=false) {
  return stringToBase64(bytesArrayToString(input), safe, removePadding)
}