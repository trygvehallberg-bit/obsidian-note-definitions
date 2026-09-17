import { CachedMetadata, getFrontMatterInfo, parseYaml } from "obsidian";

export interface FileFrontmatter {
	data: Record<string, unknown> | undefined;
	contentStart: number;
}

/**
 * Read frontmatter from the metadata cache when available, and fall back to
 * the file contents while Obsidian is still warming the cache at startup.
 */
export function readFileFrontmatter(
	fileContent: string,
	cache: CachedMetadata | null,
): FileFrontmatter {
	const info = getFrontMatterInfo(fileContent);
	const data =
		cache?.frontmatter ??
		(info.exists ? parseYaml(info.frontmatter) : undefined);
	const contentStart = cache?.frontmatterPosition
		? cache.frontmatterPosition.end.offset + 1
		: info.exists
			? info.contentStart
			: 0;

	return { data, contentStart };
}
