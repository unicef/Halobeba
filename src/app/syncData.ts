import { dataRealmStore, apiStore } from "../stores";
import { ContentResponse, ApiImageData, BasicPagesResponse, MilestonesResponse } from "../stores/apiStore";
import { ContentEntitySchema, ContentEntity } from "../stores/ContentEntity";
import { appConfig } from "./appConfig";
import { content } from "./content";
import { navigation } from "../app/Navigators";
import { BasicPageEntity, BasicPagesEntitySchema } from "../stores/BasicPageEntity";
import { MilestoneEntity, MilestoneEntitySchema } from "../stores/MilestoneEntity";
import { DailyMessageEntitySchema } from "../stores/DailyMessageEntity";
import { UnknownError } from "./errors";
import { PollsEntity, PollsEntitySchema } from "../stores/PollsEntity";

/**
 * Sync data between API and realm.
 */
class SyncData {
    private static instance: SyncData;

    private constructor() { }

    static getInstance(): SyncData {
        if (!SyncData.instance) {
            SyncData.instance = new SyncData();
        }
        return SyncData.instance;
    }

    public async sync(): Promise<true | Error> {
        // CHECK IF API IS AVAILABLE
        const isApiAvailable = await apiStore.isApiAvailable();

        if (isApiAvailable instanceof Error) {
            return isApiAvailable;
        }

        // VARIABLES
        const lastSyncTimestamp = dataRealmStore.getVariable('lastSyncTimestamp');

        // SYNC DATA REPORT
        let syncDataReport: string[] = [];

        // DOWNLOAD VOCABULARIES AND TERMS
        const vocabulariesAndTerms = await apiStore.getVocabulariesAndTerms();

        if (vocabulariesAndTerms?.categories && vocabulariesAndTerms.categories.length > 0) {
            await dataRealmStore.setVariable('vocabulariesAndTerms', vocabulariesAndTerms);

            if (appConfig.showLog) {
                console.log('syncData.sync(): Saved vocabularies and terms');
            }
        }

        syncDataReport.push(`VOCABULARIES AND TERMS = Categories:${vocabulariesAndTerms.categories.length}, Keywords:${vocabulariesAndTerms.keywords.length}, Predefined tags:${vocabulariesAndTerms.predefined_tags.length}`);

        // DOWNLOAD DEVELOPMENT MILESTONES 
        let allMilestones: MilestonesResponse = { total: 0, data: [] }

        try {
            if (lastSyncTimestamp) {
                allMilestones = await apiStore.getAllMilestones(lastSyncTimestamp)
            } else {
                allMilestones = await apiStore.getAllMilestones();
            }
        } catch (e) {
            const netError = new UnknownError(e);
            dataRealmStore.setVariable('lastDataSyncError', 'getAllMilestones failed, ' + netError.message);
        };

        // Save milestones
        if (allMilestones?.data && allMilestones.data.length > 0) {
            const milestonesCreateOrUpdate: Promise<MilestoneEntity>[] = [];

            allMilestones.data.forEach((value) => {
                milestonesCreateOrUpdate.push(dataRealmStore.createOrUpdate(MilestoneEntitySchema, value))
            });

            try {
                await Promise.all(milestonesCreateOrUpdate);

                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved all milestones');
                };
            } catch (e) {
                const netError = new UnknownError(e);
                dataRealmStore.setVariable('lastDataSyncError', 'milestonesCreateOrUpdate failed, ' + netError.message);
            };
        };

        syncDataReport.push(`DEVELOPMENT MILESTONES = Total:${allMilestones.data.length}`);

        // DOWNLOAD ALL CONTENT
        let allContent: ContentResponse = { total: 0, data: [] };

        try {
            if (lastSyncTimestamp) {
                allContent = await apiStore.getAllContent(undefined, lastSyncTimestamp);
            } else {
                allContent = await apiStore.getAllContent();
            };
        } catch (e) {
            const netError = new UnknownError(e);
            dataRealmStore.setVariable('lastDataSyncError', 'getAllContent failed, ' + netError.message);
        };

        // Save content
        if (allContent?.data && allContent.data.length > 0) {
            const promisesCreateOrUpdate: Promise<ContentEntity>[] = [];

            allContent.data.forEach((value) => {
                promisesCreateOrUpdate.push(dataRealmStore.createOrUpdate(ContentEntitySchema, value));
            });

            try {
                await Promise.all(promisesCreateOrUpdate);

                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved all content');
                };
            } catch (e) {
                const netError = new UnknownError(e);
                dataRealmStore.setVariable('lastDataSyncError', 'All content createOrUpdate failed, ' + netError.message);
            };
        }

        syncDataReport.push(`CONTENT = Total:${allContent.data.length}`);

        // DOWNLOAD ALL DAILY MESSAGES
        let allDailyMessages: ContentResponse = { total: 0, data: [] };

        try {
            if (lastSyncTimestamp) {
                allDailyMessages = await apiStore.getAllDailyMessages(lastSyncTimestamp);
            } else {
                allDailyMessages = await apiStore.getAllDailyMessages();
            };
        } catch (e) {
            const netError = new UnknownError(e);
            dataRealmStore.setVariable('lastDataSyncError', 'getAllDailyMessages failed, ' + netError.message);
        };

        // Save content
        if (allDailyMessages?.data && allDailyMessages.data.length > 0) {
            const promisesCreateOrUpdate: Promise<ContentEntity>[] = [];

            allDailyMessages.data.forEach((value) => {
                promisesCreateOrUpdate.push(dataRealmStore.createOrUpdate(DailyMessageEntitySchema, value));
            });

            try {
                await Promise.all(promisesCreateOrUpdate);

                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved all daily messages');
                };
            } catch (e) {
                const netError = new UnknownError(e);
                dataRealmStore.setVariable('lastDataSyncError', 'allDailyMessages createOrUpdate failed, ' + netError.message);
            };
        }

        syncDataReport.push(`DAILY MESSAGES = Total:${allDailyMessages.data.length}`);

        // DOWNLOAD BASIC PAGES 
        const basicPages = await apiStore.getBasicPages();
        // save basic pages 
        if (basicPages?.data && basicPages.data.length > 0) {
            const basicPageCreateOrUpdate: Promise<BasicPageEntity>[] = [];

            basicPages.data.forEach((value) => {
                basicPageCreateOrUpdate.push(dataRealmStore.createOrUpdate(BasicPagesEntitySchema, value));
            });
            
            try {
                await Promise.all(basicPageCreateOrUpdate);
                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved basic pages');
                };
            } catch (e) {
                const netError = new UnknownError(e);
                dataRealmStore.setVariable('lastDataSyncError', 'basicPageCreateOrUpdate failed, ' + netError.message);
            };
        };

        syncDataReport.push(`BASIC PAGES = Total:${basicPages.data.length}`);


        // DELETE POLLS 
        dataRealmStore.deletePolls();

        // DOWNLOAD POLLS
        const polls = await apiStore.getPolls();
        // save polls
        if (polls?.data && polls.data.length > 0) {
            const pollsCreateOrUpdate: Promise<PollsEntity>[] = [];
            polls.data.forEach((value) => {
                pollsCreateOrUpdate.push(dataRealmStore.createOrUpdate(PollsEntitySchema, value));
            });
            try {
                await Promise.all(pollsCreateOrUpdate);
                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved polls');
                };
            } catch (e) {
                console.log(e, "e")
                const netError = new UnknownError(e);
                // dataRealmStore.setVariable('lastDataSyncError' ‘PollsCreateOrUpdate failed, ’ + netError.message);
            };
        };

        // DOWNLOAD COVER IMAGES
        let numberOfFailedImageDownloads: number | undefined = 0;

        if (allContent?.data && allContent.data.length > 0) {
            const apiImagesData: ApiImageData[] = [];

            allContent.data.forEach((contentEntity) => {
                const coverImageData = content.getCoverImageData(contentEntity);

                if (coverImageData) {
                    apiImagesData.push(coverImageData);
                }
            });

            const imagesDownloadResult = await apiStore.downloadImages(apiImagesData);

            numberOfFailedImageDownloads = imagesDownloadResult?.reduce((acc, currentValue) => {
                if (!currentValue.success) {
                    return acc + 1;
                } else {
                    return acc;
                }
            }, 0);
            if (numberOfFailedImageDownloads === undefined) numberOfFailedImageDownloads = 0;

            syncDataReport.push(`CONTENT IMAGES = Total:${allContent.data.length}, Failed downloads:${numberOfFailedImageDownloads}`);
        }

        // UPDATE lastSyncTimestamp
        const allContentIsDownloaded = allContent.total > 0 && allContent.data.length === allContent.total;

        if (allContentIsDownloaded && numberOfFailedImageDownloads === 0) {
            await dataRealmStore.setVariable('lastSyncTimestamp', Math.round(Date.now() / 1000));

            if (appConfig.showLog) {
                console.log('syncData.sync(): Updated lastSyncTimestamp');
            }
        } else {
            if (appConfig.showLog) {
                console.log('syncData.sync(): lastSyncTimestamp was NOT updated');
            }
        }

        // SAVE SYNC REPORT
        await dataRealmStore.setVariable('syncDataReport', syncDataReport);

        // RETURN ERROR IF DOWNLOAD FAILED
        if (!allContentIsDownloaded || numberOfFailedImageDownloads !== 0) {
            return new Error('Data download failed');
        }

        return true;
    }

    public async syncAndShowSyncingScreen() {
        try {
            navigation.navigate('RootModalStackNavigator_SyncingScreen');
            await syncData.sync();
            navigation.navigate('HomeStackNavigator_HomeScreen');
        } catch (e) {
            navigation.navigate('HomeStackNavigator_HomeScreen');
        }
    }
}

export const syncData = SyncData.getInstance();