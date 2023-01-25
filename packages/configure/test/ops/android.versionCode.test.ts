import { copy } from '@ionic/utils-fs';
import { join } from 'path';
import tempy from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/android/version';
import { makeOp } from '../utils';

describe('op: android.versionCode', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = tempy.directory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('shouldn\'t break build when updating empty versionCode', async () => {
    const op: Operation = makeOp('android', 'versionCode', '');
    await Op(ctx, op as Operation);
    expect(await ctx.project.android?.getVersionCode()).toBe(1);
  });

});
