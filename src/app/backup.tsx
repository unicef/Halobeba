import { googleAuth } from "./googleAuth";
import { googleDrive } from "./googleDrive";
import { userRealmStore, dataRealmStore } from "../stores";
import { appConfig } from "./appConfig";
import { utils } from ".";
import { translate } from "../translations/translate";
import RNFS from 'react-native-fs';
import { UserRealmContextValue } from "../stores/UserRealmContext";

/**
 * Export / import user realm to GDrive in order to create backup.
 */
class Backup {
    private static instance: Backup;

    private constructor() {}

    static getInstance(): Backup {
        if (!Backup.instance) {
            Backup.instance = new Backup();
        }
        return Backup.instance;
    }

    public async export(): Promise<boolean> {
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return false;
        }

        // Get userRealmPath
        const userRealmPath = userRealmStore.realm?.path;
        if (!userRealmPath) return false;

        // Get realmContent
        const realmContent = await RNFS.readFile(userRealmPath, 'base64');

        // Get backupFolderId
        let backupFolderId = await googleDrive.safeCreateFolder({
            name: appConfig.backupGDriveFolderName,
            parentFolderId: 'root'
        });

        if (backupFolderId instanceof Error) {
            return false;
        }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${appConfig.backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });

        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }

        // Delete backupFileId
        if (backupFileId) {
            await googleDrive.deleteFile(backupFileId);
        }

        // Create file on gdrive
        const response = await googleDrive.createFileMultipart({
            name: appConfig.backupGDriveFileName,
            content: realmContent,
            contentType: 'application/realm',
            parentFolderId: backupFolderId,
            isBase64: true,
        });

        if (typeof response !== 'string') {
            // utils.setMyDebbugTxt(response.message);
            return false;
        }

        return true;
    }

    public async import(userRealmContext: UserRealmContextValue): Promise<void|Error> {
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return new Error(translate('loginCanceled'));
        }

        // Get backupFolderId
        let backupFolderId = await googleDrive.safeCreateFolder({
            name: appConfig.backupGDriveFolderName,
            parentFolderId: 'root'
        });

        if (backupFolderId instanceof Error) {
            return new Error('Backup folder doesnt exist on GDrive');
        }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${appConfig.backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });

        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }

        if (!backupFileId) {
            return new Error(translate('settingsButtonImportError'));
        }

        // Close user realm
        userRealmContext.closeRealm();

        // Download file from GDrive
        await googleDrive.download({
            fileId: backupFileId,
            filePath: RNFS.DocumentDirectoryPath + '/' + 'user.realm',
        });

        // Open user realm
        await userRealmContext.openRealm();

        // Set current child to first child
        const allChildren = userRealmStore.getAllChildren();
        if (allChildren) {
            dataRealmStore.setVariable('currentActiveChildId', allChildren[0].id);
        }

        return;
    }
}

export const backup = Backup.getInstance();