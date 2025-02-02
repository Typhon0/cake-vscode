import { commands, window, workspace } from 'vscode';
import * as fs from 'fs';
import { CakeBakery } from './cakeBakery';

export async function updateCakeBakeryCommand(extensionPath: string) {
    // Make sure that we're in the correct place.
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return;
    }

    // Install Cake Bakery
    var result = await installCakeDebug(extensionPath);
    if (result) {
        commands.executeCommand('o.restart');
        window.showInformationMessage(
            'Intellisense support for Cake files was installed.'
        );
    } else {
        window.showErrorMessage(
            'Error downloading intellisense support for Cake files.'
        );
    }
}

export async function installCakeDebug(extensionPath: string): Promise<boolean> {
    let bakery = new CakeBakery(extensionPath);

    var targetPath = bakery.getNupkgDestinationPath();
    if (fs.existsSync(targetPath)) {
        fs.rmdirSync(targetPath, {recursive: true});
    }

    return await bakery.downloadAndExtract();
}
