'use strict';
import * as vscode from 'vscode';
import installPackage from './installPackage';
import {Package, PackageQuickPickItem} from './model';
import search from './search';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
                        'extension.nugetReversePackageSearch',
                        executeReversePackageSearch,
                    );

    context.subscriptions.push(disposable);

    return {
        installPackage,
        search,
    };
}

function executeReversePackageSearch() {

    let window = vscode.window,
        editor = vscode.window.activeTextEditor,
        query = editor && editor.document.getText(editor.selection);

    let req = search(query)
                .then(onPackageSearchComplete.bind(this, query))
                .catch(onPackageSearchError);

    window.setStatusBarMessage(
        `Performing reverse NuGet package search for "${query}"...`,
        req,
    );
}

function onPackageSearchComplete(query: string, packages: Package[]) {

    if (!packages.length) {
        vscode.window.showInformationMessage(`No packages found for "${query}"`);
        return;
    }

    let quickPicks = packages.map(x => <PackageQuickPickItem> {
        Name: x.Name,
        Version: x.Version,
        description: x.Version,
        label: x.Name,
    });

    vscode.window.showQuickPick(quickPicks)
        .then(installPackage);
}

function onPackageSearchError(err) {
    console.error(err);
    vscode.window.showErrorMessage(err);
}

// this method is called when your extension is deactivated
export function deactivate() {
    // Intentionally empty (for now)
}
