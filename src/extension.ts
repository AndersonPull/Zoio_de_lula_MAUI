import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "zoioDeLula" is now active!');

	let disposable = vscode.commands.registerCommand('zoioDeLula.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from zoioDeLula!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }