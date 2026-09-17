export class App {
	vault: Vault;
	metadataCache: MetadataCache;
	fileManager: FileManager;

	constructor() {
		this.vault = new Vault();
		this.metadataCache = new MetadataCache();
		this.fileManager = new FileManager();
	}
}

export class FileManager {
	async processFrontMatter(
		file: TFile,
		fn: (fm: Record<string, any>) => void,
	): Promise<void> {
		fn({});
	}
}

export class TFile {
	basename: string;
	extension: string;

	// Ignore other properties
}

export class PluginSettingTab {}

export class Vault {
	modify(file: TFile, data: string) {}
	read(file: TFile): Promise<string> {
		return Promise.resolve("");
	}
	cachedRead(file: TFile): Promise<string> {
		return Promise.resolve("");
	}
}

export class MetadataCache {
	getFileCache(file: TFile) {
		return null;
	}
}

export class Notice {}

export function getFrontMatterInfo(content: string) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) {
		return {
			exists: false,
			frontmatter: "",
			from: 0,
			to: 0,
			contentStart: 0,
		};
	}
	const openingLength = match[0].indexOf(match[1]);
	return {
		exists: true,
		frontmatter: match[1],
		from: openingLength,
		to: openingLength + match[1].length,
		contentStart: match[0].length,
	};
}

export function parseYaml(yaml: string): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	const lines = yaml.split(/\r?\n/);
	for (let index = 0; index < lines.length; index++) {
		const match = lines[index].match(/^([^:]+):\s*(.*)$/);
		if (!match) continue;
		const key = match[1].trim();
		const scalar = match[2].trim();
		if (scalar) {
			result[key] = scalar.replace(/^['"]|['"]$/g, "");
			continue;
		}
		const values: string[] = [];
		while (index + 1 < lines.length) {
			const item = lines[index + 1].match(/^\s+-\s+(.+)$/);
			if (!item) break;
			values.push(item[1].trim().replace(/^['"]|['"]$/g, ""));
			index++;
		}
		result[key] = values;
	}
	return result;
}
