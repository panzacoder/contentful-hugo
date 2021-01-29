import { resolve } from 'path';
import { ContentfulHugoConfig } from '@/main';
import { Entry } from 'contentful';
import determineFileLocations from './determineFileLocation';
import fetchEntry from './fetchEntryFromContentful';
import deleteFile from './deleteFile';

export interface EntryUpdatePayload {
    entryId: string;
    contentType: string;
    date: Date;
    message: string;
    files: string[];
}

const updateEntry = (
    config: ContentfulHugoConfig,
    sys: Entry<unknown>['sys'],
    previewMode: boolean
): Promise<EntryUpdatePayload> => {
    return fetchEntry(sys.id, sys.contentType.sys.id, config, previewMode).then(
        () => {
            const fileLocations = determineFileLocations(
                config,
                sys.id,
                sys.contentType.sys.id,
                false
            );
            for (const location of fileLocations) {
                console.log(`created ${resolve(location)}`);
            }
            const message = `Created ${fileLocations.length} file${
                fileLocations.length === 1 ? '' : 's'
            }`;
            const payload = {
                message,
                date: new Date(),
                entryId: sys.id,
                contentType: sys.contentType.sys.id,
                files: fileLocations,
            };
            return payload;
        }
    );
};

const removeEntry = (
    config: ContentfulHugoConfig,
    sys: Entry<unknown>['sys']
): Promise<EntryUpdatePayload> => {
    const filePaths = determineFileLocations(
        config,
        sys.id,
        sys.contentType.sys.id,
        true
    );
    const tasks: Promise<null>[] = [];
    for (const path of filePaths) {
        tasks.push(deleteFile(path));
    }
    return Promise.all(tasks).then(() => {
        const message = `Deleted ${filePaths.length} file${
            filePaths.length === 1 ? '' : 's'
        }`;
        return {
            date: new Date(),
            message,
            entryId: sys.id,
            contentType: sys.contentType.sys.id,
            files: filePaths,
        };
    });
};

export { updateEntry, removeEntry };
