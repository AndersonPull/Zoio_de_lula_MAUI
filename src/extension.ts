import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// 👍 formatter implemented using API
	vscode.languages.registerDocumentFormattingEditProvider('XAML', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const firstLine = document.lineAt(0);
			let retorno: vscode.TextEdit[] = [];

			if (firstLine.text !== 'Formatado') {
				retorno = [vscode.TextEdit.insert(firstLine.range.start, ' Formatado\n')];
			}
			return retorno;
		}
	});
}