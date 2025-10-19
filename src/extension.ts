import * as vscode from 'vscode';
import { XamlFormatter } from "./formatting/xaml-formatter";

export function activate(context: vscode.ExtensionContext) {
	let formatter = new XamlFormatter();

	const disposable = vscode.languages.registerDocumentFormattingEditProvider(['xaml', 'axaml'], {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const edits = formatter.formatXaml(document);
			const combined = edits.map(e => e.newText).join('');
			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(document.getText().length)
			);
			return [new vscode.TextEdit(fullRange, combined)];
		}
	});

	context.subscriptions.push(disposable);

	const cmd = vscode.commands.registerCommand('zoiodelula.Format', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		await vscode.commands.executeCommand('editor.action.formatDocument');
	});
	context.subscriptions.push(cmd);
}