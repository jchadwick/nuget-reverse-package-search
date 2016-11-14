import * as vscode from 'vscode';

export interface Package {
    Name: string;
    Version: string;
}

export interface PackageQuickPickItem extends Package, vscode.QuickPickItem {
    package: Package;
}
