import plist from 'plist';
import { readFile } from '@ionic/utils-fs';
import { mergeWith, union } from 'lodash';

export async function parsePlist(filename: string) {
  const contents = await readFile(filename, { encoding: 'utf-8' });

  const parsed = plist.parse(contents);

  // If the plist is empty an empty array will come back
  // which is not what we want
  if (!(parsed as any[]).length) {
    return {};
  }

  return parsed;
}


export function updatePlist(entries: any, parsed: any) {
  const merged = mergeWith(parsed, entries, (objValue, srcValue) => {
    // Override the default merge behavior for arrays of objects that have the
    // same sub-key. Otherwise lodash merge doesn't work how we need it to
    if (Array.isArray(objValue)) {
      return union(objValue, srcValue);
    }
  });

  return merged;
}
