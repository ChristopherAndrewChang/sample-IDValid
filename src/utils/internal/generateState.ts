import { v4 as uuidv4 } from 'uuid';

export default function generateState(): string {
  return uuidv4()
}