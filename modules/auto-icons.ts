import 'wxt';
import { defineWxtModule } from 'wxt/modules';

import defu from 'defu';
import { ensureDir, exists } from 'fs-extra';
import { relative, resolve } from 'node:path';
import sharp from 'sharp';

export default defineWxtModule({
  name: 'auto-icons',
  configKey: 'autoIcons',
  async setup(wxt, options) {
    const parsedOptions = defu<Required<AutoIconsOptions>, AutoIconsOptions[]>(options, {
      enabled: true,
      sizes: {},
    });

    if (!parsedOptions.enabled) {
      return wxt.logger.warn(`\`[auto-icons]\` ${this.name} disabled`);
    }
    if (Object.keys(parsedOptions.sizes).length === 0) {
      return wxt.logger.warn(`\`[auto-icons]\` No icon sizes specified, skipping icon generation`);
    }

    const resolvedPaths = new Map<number, string>();
    const rejectedPaths = new Map<number, string>();
    await Promise.all(
      Object.entries(parsedOptions.sizes).map(async ([size, path]) => {
        const resovedPath = resolve(wxt.config.srcDir, path);
        if (await exists(resovedPath)) {
          resolvedPaths.set(Number(size), resovedPath);
        } else {
          rejectedPaths.set(Number(size), resovedPath);
        }
      }),
    );

    if (rejectedPaths.size > 0) {
      const list = [...rejectedPaths.entries()]
        .map(([size, path]) => ` - ${size}: ${relative(wxt.config.srcDir, path)}`)
        .join('\n');
      if (resolvedPaths.size === 0) {
        return wxt.logger.warn(
          `\`[auto-icons]\` No valid icon source paths found, skipping icon generation:\n${list}`,
        );
      } else {
        wxt.logger.warn(
          `\`[auto-icons]\` Some icon source paths were not found and will be skipped:\n${list}`,
        );
      }
    }

    wxt.hooks.hook('build:manifestGenerated', async (_wxt, manifest) => {
      if (manifest.icons) {
        return _wxt.logger.warn(
          '`[auto-icons]` icons property found in manifest, overwriting with auto-generated icons',
        );
      }
      manifest.icons = Object.fromEntries(
        [...resolvedPaths.keys()].map((size) => [size, `icons/${size}.png`]),
      );
    });

    wxt.hooks.hook('build:done', async (_wxt, output) => {
      const outputFolder = _wxt.config.outDir;
      const generated: string[] = [];
      await Promise.all(
        [...resolvedPaths.entries()].map(async ([size, path]) => {
          const resizedImage = sharp(path).resize(size).png();
          await ensureDir(resolve(outputFolder, 'icons'));
          const generatedPath = resolve(outputFolder, 'icons', `${size}.png`);
          await resizedImage.toFile(generatedPath);
          generated.push(generatedPath);
          output.publicAssets.push({
            type: 'asset',
            fileName: `icons/${size}.png`,
          });
        }),
      );
      _wxt.logger.info(
        `\`[auto-icons]\` Generated icon(s):\n${generated.map((path) => ` - ${relative(_wxt.config.srcDir, path)}`).join('\n')}`,
      );
    });

    wxt.hooks.hook('prepare:publicPaths', (_wxt, paths) => {
      for (const size of resolvedPaths.keys()) {
        paths.push(`icons/${size}.png`);
      }
    });
  },
});

export interface AutoIconsOptions {
  enabled?: boolean;
  sizes: Record<number, string>;
}

declare module 'wxt' {
  export interface InlineConfig {
    autoIcons?: AutoIconsOptions;
  }
}
