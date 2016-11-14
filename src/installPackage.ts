import * as vscode from 'vscode';
import {Package} from './model';

export default function installPackage(pkg: Package) {
    
    if(!pkg) {
        console.log('Refusing to install empty package');
        return;
    }

    vscode.window.showInformationMessage(`TODO: Install package ${pkg.Name}`)
}