import * as vscode from 'vscode';
import { XamlFormatter } from "./formatting/xaml-formatter";

export function activate() {
	let xamlFormatter = new XamlFormatter();

	vscode.languages.registerDocumentFormattingEditProvider(['XAML', 'AXAML'], {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			return xamlFormatter.formatXaml(document);
		}
	});
}