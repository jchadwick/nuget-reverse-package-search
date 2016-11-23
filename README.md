# Visual Studio Code Extension: NuGet Reverse Package Search

Adds reverse .NET Core package lookup support like the "Add Package" context menu  item in full Visual Studio

## Features

Whenever you type some code that you think should work but OmniSharp tells you that it's not valid, it might be due to a missing NuGet package.

To fix this, just highlight the text and run the `NuGet Reverse Package Search` command to search the package repository.
Once the results are found, you can select the package to install from the drop-down and the extension will add the package to your project. 

\!\[See it in action\]\(docs/images/demo.gif\)


## Requirements

* A .NET Core project _(only the "new" .csproj format is supported)_
* _(optional)_ The OmniSharp plugin (why would you be doing .NET Core development without it??)

## Extension Settings

This extension does not currently expose any configurable settings.

## Known Issues

_No known issues_

Found an issue?  Report it on the [Extension Issues](https://github.com/jchadwick/nuget-reverse-package-search/issues) page!

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release.

### 0.0.4

No changes - just a build that happen when I automated deployment via AppVeyor.