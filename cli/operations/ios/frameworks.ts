import { join } from 'path';
import { writeFile } from '@ionic/utils-fs';
import { parsePbxProject } from '../../util/pbx';

export default async function execute(ctx, op) {
  const filename = join(
    ctx.rootDir,
    'ios',
    'App',
    'App.xcodeproj',
    'project.pbxproj',
  );

  const proj = await parsePbxProject(filename);

  const frameworks = op.value;

  for (let framework of frameworks) {
    proj.addFramework(framework, {
      embed: false,
    });
  }

  await writeFile(filename, proj.writeSync());
}