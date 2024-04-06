import * as vscode from 'vscode';
import { XamlFormatter } from "./formatting/xaml-formatter";

export function activate(context: vscode.ExtensionContext) {
	let xamlFormatter = new XamlFormatter();

	vscode.languages.registerDocumentFormattingEditProvider('XAML', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			return xamlFormatter.formatXaml(document);
		}
	});
}