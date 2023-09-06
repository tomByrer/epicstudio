import fsp from "fs/promises";
import path from "path";

const locales = ["it"];
const defaultLocale = "en";
const paths = ["[...portfolio]/[...page]", "[...portfolio]/[category]/[...page]", "[...portfolio]/[tag]/[...page]", "[...portfolio]/index"];

async function main() {
	const __dirname = path.resolve();

	async function fix(filePath, locale = defaultLocale) {
		const regex = /getStaticPaths\([^)]*\)\s*{/;

		let data = await fsp.readFile(filePath, { encoding: "utf-8" });

		const match = data.match(regex);

		const changeLanguageString = `changeLanguage('${locale}')`;

		if (match) {
			const index = match.index + match[0].length;
			data = data.slice(0, index) + changeLanguageString + data.slice(index);
			await fsp.writeFile(filePath, data, { encoding: "utf-8" });
		}
	}

	for (const filePath of paths) {
		for (const locale of locales) {
			await fix(path.join(__dirname, `./src/pages/${locale}/${filePath}.astro`), locale);
		}
		await fix(path.join(__dirname, `./src/pages/${filePath}.astro`));
	}
}

main();
