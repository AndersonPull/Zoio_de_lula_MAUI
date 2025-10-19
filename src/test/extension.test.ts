import * as assert from 'assert';
import { XamlFormatter } from "../formatting/xaml-formatter";
import fs from 'fs';
import { Settings } from "../common/settings";
import * as vscode from 'vscode';

suite('Basic suite', () => {
	vscode.window.showInformationMessage('Start all basic tests.');

	test('Default formatting', async () => {
		let settings = new Settings();
		await testFormatter('basic/basic', 'basic/basic', settings);
	});

	test('All attributes in the first line', async () => {
		let settings = new Settings();
		settings.positionAllAttributesOnFirstLine = true;
		await testFormatter('basic/basicAllAttributesInTheFirstLine', 'basic/basic', settings);
	});

	test('Two attributes per line', async () => {
		let settings = new Settings();
		settings.numberOfAttributesPerLine = 2;
		settings.putTheFirstAttributeOnTheFirstLine = true;
		await testFormatter('basic/basicTwoAttributesPerLine', 'basic/basic', settings);
	});

	test('Do not use self-closing tags', async () => {
		let settings = new Settings();
		settings.useSelfClosingTags = false;
		await testFormatter('basic/basicDoNotUseSelf-closingTags', 'basic/basic', settings);
	});

	test('Ignore comments', async () => {
		let settings = new Settings();
		await testFormatter('basic/basicIgnoreComments', 'basic/basicIgnoreComments', settings);
	});
});

suite('Unused attributes suite', () => {
	vscode.window.showInformationMessage('Start all testing of unused attributes.');

	test('Remove unused attributes', async () => {
		let settings = new Settings();
		settings.removeUnusedAttributes = true;
		await testFormatter('unusedAttributes/removeUnusedAttributes', 'unusedAttributes/removeUnusedAttributes', settings);
	});

	test('Keep unused attributes', async () => {
		let settings = new Settings();
		settings.removeUnusedAttributes = true;
		await testFormatter('unusedAttributes/keepUnusedAttributes', 'unusedAttributes/keepUnusedAttributes', settings);
	});
});

suite('BugFix suite', () => {
	vscode.window.showInformationMessage('Start all testing of unused attributes.');

	test('line break in last attribute', async () => {
		let settings = new Settings();
		settings.removeUnusedAttributes = true;
		await testFormatter('bugFix/lineBreakInLastAttribute', 'bugFix/lineBreakInLastAttribute', settings);
	});

	test('Issue 1', async () => {
		let settings = new Settings();
		settings.removeUnusedAttributes = true;
		await testFormatter('bugFix/issue1', 'bugFix/issue1', settings);
	});

	test('Issue 2', async () => {
		let settings = new Settings();
		await testFormatter('bugFix/issue2', 'bugFix/issue2', settings, "axaml");
	});

	test('Issue 4', async () => {
		let settings = new Settings();
		await testFormatter('basic/basic', 'bugFix/issue4', settings, "xaml");
	});
});

async function testFormatter(fileNameFormatted: string, fileNameUnformatted: string, settings: Settings, extesion: string = "xaml"): Promise<void> {
	let xamlFormatter = new XamlFormatter();

	const expectedFormattedXaml = dataLoader(`${fileNameFormatted}.formatted.${extesion}`).replace(/\r/g, "");
	const unformattedXaml = dataLoader(`${fileNameUnformatted}.unformatted.${extesion}`);

	const document = await vscode.workspace.openTextDocument({ content: unformattedXaml });
	const textEdits = xamlFormatter.formatXaml(document, settings);

	const actualFormattedText = textEdits.map(edit => edit.newText).join('');
	assert.strictEqual(actualFormattedText, expectedFormattedXaml, 'The current formatted XAML does not match the expected formatted XAML.');
}

function dataLoader(fileName: string): string {
	return fs.readFileSync(`${__dirname}/../../src/test/data/${fileName}`, 'utf-8');
}