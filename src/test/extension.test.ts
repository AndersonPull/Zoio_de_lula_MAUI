import * as assert from 'assert';
import { XamlFormatter } from "../formatting/xaml-formatter";
import fs from 'fs';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('basic formatting', async () => {
		await testFormatter('basic');
	});
});

async function testFormatter(fileName: string): Promise<void> {
	let xamlFormatter = new XamlFormatter();

	const expectedFormattedXaml = dataLoader(`${fileName}.formatted.xaml`).replace(/\r/g, "");
	const unformattedXaml = dataLoader(`${fileName}.unformatted.xaml`);

	const document = await vscode.workspace.openTextDocument({ content: unformattedXaml });
	const textEdits = xamlFormatter.formatXaml(document);

	const actualFormattedText = textEdits.map(edit => edit.newText).join('');
	assert.strictEqual(actualFormattedText, expectedFormattedXaml, 'The current formatted XAML does not match the expected formatted XAML.');
}

function dataLoader(fileName: string): string {
	return fs.readFileSync(`${__dirname}/../../src/test/data/${fileName}`, 'utf-8');
}