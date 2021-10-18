import { join } from 'path';
import { Context } from '../../ctx';

export default async function execute(ctx: Context, op) {
  const filename = join(
    ctx.rootDir,
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  );

  const change = await ctx.project.android.setPackageName(op.value);

  return [change];
}
