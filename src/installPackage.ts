import { exec } from 'child_process';
import { Uri, window, workspace } from 'vscode';
import { Package } from './model';

const packageReferenceClosingTag = "</PackageReference>";

export default async function installPackage(pkg: Package) {

    if (!pkg) {
        console.log('Refusing to install empty package');
        return;
    }

    let docUri = window.activeTextEditor.document.uri,
        projectFile = await findProjectFile(docUri);

    if (!projectFile) {
        return;
    }

    addReferenceToProjectFile(pkg, projectFile)
        .then(restorePackages)
        .then(x => window.setStatusBarMessage(`Installed package ${pkg.Name} <${pkg.Version}>`, 5000))
        .catch(err => window.showErrorMessage(err));
    }

async function addReferenceToProjectFile(pkg: Package, projectFile: Uri) {

    let projectDocument = await workspace.openTextDocument(projectFile),
        projectText = projectDocument.getText(),
        alreadyHasReference = (projectText.indexOf(pkg.Name) !== -1),
        insertIndex = projectText.lastIndexOf(packageReferenceClosingTag);

    if (alreadyHasReference) {
        return;
    }

    if (!insertIndex) {
        return;
    }

    let insertPosition = projectDocument.positionAt(insertIndex + packageReferenceClosingTag.length),
        currentDocument = window.activeTextEditor.document,
        projectEditor = await window.showTextDocument(projectDocument);

    await projectEditor.edit(editor =>
    editor.insert(insertPosition, `
    <PackageReference Include="${pkg.Name}">
      <Version>${pkg.Version}</Version>
    </PackageReference>`));

    await projectDocument.save();

    window.showTextDocument(currentDocument);

    return projectFile;
}

async function restorePackages(projectFile: Uri) {

    return new Promise((resolve, reject) => {

        exec(`dotnet restore "${projectFile.fsPath}"`, (errorMesg, out, err) => {
            if (errorMesg) {
                reject(err);
            } else {
                resolve();
            }
        });

    });
}

async function findProjectFile(uri: Uri) {

    let paths = getRootPaths(uri),
        projectFiles = await workspace.findFiles('**/*.csproj', ''),
        matches = projectFiles.filter(x =>
            paths.filter(path => x.toString().startsWith(path)).length,
        );

    console.log(`Found ${matches.length} project files: ${JSON.stringify(matches.map(x => x.toString()))}`);

    return matches.length ? matches[0] : null;
}

function getRootPaths(uri: Uri): string[] {

    let paths = [],
        currentPath = uri.toString();

    while (currentPath.lastIndexOf('/') > 0) {
        currentPath = currentPath.substr(0, currentPath.lastIndexOf('/'));
        paths.push(currentPath);
    }

    return paths;
}
