import base64ToString from './base64ToString';
import stringToBytesArray from './stringToBytesArray';

export default function base64ToBytesArray(input, safe=false) {
  return stringToBytesArray(base64ToString(input, safe))
}