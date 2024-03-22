import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "mauiformatting" is now active!');

	let disposable = vscode.commands.registerCommand('mauiformatting.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from mauiformatting!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }