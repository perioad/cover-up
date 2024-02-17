import manifests from "./manifest.json" with { type: "json"};
import { readFile, writeFile } from 'node:fs/promises'

const [manifest] = manifests;
const filePath = new URL('../README.md', import.meta.url);
const contents = await readFile(filePath, { encoding: 'utf8' });
const startComment = '<!-- lhci badges start -->';
const endComment = '<!-- lhci badges end -->';
const [fileBeginning, rest] = contents.split(startComment);
const [, fileEnding] = rest.split(endComment);
const badges = getBadges(manifest.summary);
const result = fileBeginning
	+ startComment
	+ '\n'
	+ badges.join(' ')
	+ '\n'
	+ endComment
	+ fileEnding;


await writeFile(filePath, result, { encoding: 'utf8' })

function getBadges(manifestSummary) {
	return Object.entries(manifestSummary).map(([key, score]) => {
		const label = key.replace('-', '_').toUpperCase();

		return getBadge(label, score);
	})
}

function getBadge(label, score) {
	const scorePercents = score * 100;
	const color = scorePercents > 97 ? 'green' : 'red';

	return `![${label}](https://img.shields.io/badge/${label}-${scorePercents}-${color}.svg)`;
}