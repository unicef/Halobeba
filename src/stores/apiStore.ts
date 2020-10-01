import { appConfig } from "../app/appConfig";
import { localize, utils } from "../app";
import { ContentEntity, ContentEntityType } from "./ContentEntity";
import axios, { AxiosResponse } from 'axios';
import RNFS from 'react-native-fs';
import URLParser from 'url';
import { BasicPageEntity } from "./BasicPageEntity";
import { MilestoneEntity } from "./MilestoneEntity";
import { Platform } from "react-native";
import { DailyMessageEntity } from "./DailyMessageEntity";
import { dataRealmStore } from "./dataRealmStore";
import { UnknownError } from "../app/errors";
import { PollsEntity } from "./PollsEntity";

/**
 * Communication with API.
 */
class ApiStore {
    private static instance: ApiStore;

    private constructor() { }

    static getInstance(): ApiStore {
        if (!ApiStore.instance) {
            ApiStore.instance = new ApiStore();
        }
        return ApiStore.instance;
    }

    public async getDevelopmentMilestones(args: GetMilestoneArgs): Promise<MilestonesResponse> {
        // URL
        const language = localize.getLanguage();
        let url = `${appConfig.apiUrl}/list-milestone/${language}`;
        
        // URL params
        const urlParams: any = {};

        urlParams.page = args.page !== undefined ? args.page : 0;
        urlParams.published = 0; // TODO: replace with appConfig.showPublishedContent
        urlParams.numberOfItems = args.numberOfItems !== undefined ? args.numberOfItems : 10;
        if (args.updatedFromDate !== undefined) {
            urlParams.updateFromDate = args.updatedFromDate;
        }

        // Get API response
        let response: MilestonesResponse = { total: 0, data: [] };
        try {
            let axiosResponse: AxiosResponse = await axios({
                url: url,
                params: urlParams,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                },
            });

            let rawResponseJson = axiosResponse.data;
            if (rawResponseJson) {
                response.total = parseInt(rawResponseJson.total);
                response.data = rawResponseJson.data.map((rawContent: any): MilestoneEntity => {
                    return {
                        id: parseInt(rawContent.id),
                        body: rawContent.body,
                        langcode: rawContent.langcode,
                        predefined_tags: rawContent.predefined_tags ? rawContent.predefined_tags.map((value: any) => parseInt(value)) : [],
                        related_articles: rawContent.related_articles ? rawContent.related_articles.map((value: any) => parseInt(value)) : [],
                        summary: rawContent.summary,
                        title: rawContent.title,
                        type: rawContent.type,
                        created_at: new Date(rawContent.created_at * 1000),
                        updated_at: new Date(rawContent.updated_at * 1000),
                    };
                });
            };

        } catch (rejectError) {
            const netError = new UnknownError(rejectError);
            dataRealmStore.setVariable('lastDataSyncError', 'getDevelopmentMilestones failed, ' + netError.message);

            if (appConfig.showLog) {
                console.log(rejectError);
            };
        };
        return response;
    };

    public async getAllMilestones(updatedFromDate?: number): Promise<MilestonesResponse> {
        const numberOfItems = appConfig.apiNumberOfItems;
        // Make first request
        let finalMilestonsResponse = await this.getDevelopmentMilestones({
            page: 0,
            numberOfItems: numberOfItems,
            updatedFromDate: updatedFromDate,
        });

        // If all items are returned in first request
        if (finalMilestonsResponse.total <= numberOfItems) {
            if (appConfig.showLog) {
                console.log(`apiStore.getAllMilestones(): updatedFromDate=${updatedFromDate}, total:${finalMilestonsResponse.total}, data length:${finalMilestonsResponse.data?.length}`,);
            }

            return finalMilestonsResponse;
        }

        // Make other requests
        let promises: Promise<any>[] = [];

        for (let page = 1; page < Math.ceil(finalMilestonsResponse.total / numberOfItems); page++) {
            promises.push(this.getDevelopmentMilestones({
                page: page,
                numberOfItems: numberOfItems,
                updatedFromDate: updatedFromDate,
            }));
        }

        let allResponses = await Promise.all<MilestonesResponse>(promises);

        // Combine all responses
        allResponses.forEach((milestoneResponse) => {
            finalMilestonsResponse.data = finalMilestonsResponse.data.concat(milestoneResponse.data);
        });

        if (appConfig.showLog) {
            console.log(`apiStore.getAllContent(): updatedFromDate=${updatedFromDate}, total:${finalMilestonsResponse.total}, data length:${finalMilestonsResponse.data?.length}`,);
        }

        return finalMilestonsResponse;
    }

    public async getBasicPages(): Promise<BasicPagesResponse> {
        const language = localize.getLanguage();

        let url = `${appConfig.apiUrl}/list-basic-page/${language}`;
        url = this.addBasicAuthForIOS(url);
        let response: BasicPagesResponse = {
            data: [],
            total: 0,
        };

        try {
            let axiosResponse: AxiosResponse = await axios({
                url: url,
                method: 'GET',
                responseType: 'json',
                headers: { "Content-type": "application/json" },
                timeout: appConfig.apiTimeout,
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                }
            });

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response.total = parseInt(rawResponseJson.total);
                response.data = rawResponseJson.data.map((item: any): BasicPageEntity => {
                    return {
                        body: item.body,
                        title: item.title,
                        created_at: new Date(item.created_at * 1000),
                        updated_at: new Date(item.updated_at * 1000),
                        id: parseInt(item.id),
                        langcode: item.langcode,
                        type: item.type
                    };
                });
            };

        } catch (rejectError) {
            const netError = new UnknownError(rejectError);
            dataRealmStore.setVariable('lastDataSyncError', 'getBasicPages failed, ' + netError.message);

            if (appConfig.showLog) {
                console.log(rejectError, "REJECT ERROR")
            };
        };

        return response;
    };

    public async getPolls(): Promise<PollsResponse> {
        const language = localize.getLanguage();
        let url = `${appConfig.apiUrl}/list-webform/${language}`;

        url = this.addBasicAuthForIOS(url);
        let response: PollsResponse = {
            data: [],
            total: 0,
        };
        try {
            let axiosResponse: AxiosResponse = await axios({
                url: url,
                method: 'GET',
                responseType: 'json',
                headers: { "Content-type": "application/json" },
                timeout: appConfig.apiTimeout,
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                }
            });
            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response.total = parseInt(rawResponseJson.total);
                response.data = rawResponseJson.data.map((item: any): PollsEntity => {
                    return {
                        category: item.category,
                        link: item.link,
                        tags: item.tags.length ? item.tags.map((value: any) => parseInt(value)) : [],
                        title: item.title,
                        created_at: parseInt(item.created_at),
                        updated_at: parseInt(item.updated_at),
                        id: parseInt(item.id),
                        langcode: item.langcode,
                        type: item.type
                    };
                });
            };

        } catch (rejectError) {
            const netError = new UnknownError(rejectError);
            // dataRealmStore.setVariable('lastDataSyncError’, 'getPolls failed'  + netError.message);
            if (appConfig.showLog) {
                console.log(rejectError, "REJECT ERROR")
            };
        };
        return response;
    };

    public async resetPassword(userEmail: string): Promise<boolean> {
        const language = localize.getLanguage();
        const url = `${appConfig.apiUrl}/user/reset?username=${userEmail}&langcode=${language}`;

        let response: boolean = false;

        try {
            let axiosResponse: AxiosResponse = await axios({
                url: url,
                method: 'GET',
                responseType: 'json',
                headers: { "Content-type": "application/json" },
                timeout: appConfig.apiTimeout,
                auth: {
                    username: appConfig.apiAuthUsername,
                    password: appConfig.apiAuthPassword,
                },
            })

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response = rawResponseJson.status
            }
        } catch (rejectError) {
            if (appConfig.showLog) {
                console.log(rejectError, "reject error");
            }
        }

        return response
    }

    public async deleteAccount(): Promise<boolean> {

        const userEmail = await dataRealmStore.getVariable('userEmail');
        let response: boolean = false 

        if (userEmail) {
            const url = `${appConfig.apiUrl}/user/delete?username=${userEmail}`;
            try {
                let axiosResponse: AxiosResponse = await axios({
                    url: url,
                    method: 'GET',
                    responseType: 'json',
                    headers: { "Content-type": "application/json" },
                    timeout: appConfig.apiTimeout,
                    auth: {
                        username: appConfig.apiAuthUsername,
                        password: appConfig.apiAuthPassword,
                    },
                })
                let rawResponseJson = axiosResponse.data;

                if (rawResponseJson) {
                    response = rawResponseJson.status
                }
            } catch (rejectError) {
                if (appConfig.showLog) {
                    console.log(rejectError, "reject error");
                }
            }
        }

        return response
    }

    public async drupalRegister(args: DrupalRegisterArgs): Promise<boolean> {

        const DrupalRegisterApiUrl = appConfig.apiUrl.substring(0, appConfig.apiUrl.length - 3)

        let url = `${DrupalRegisterApiUrl}entity/user`
        url = this.addBasicAuthForIOS(url, true);
        const language = localize.getLanguage();

        let bodyParams = {
            "field_first_name": [{ "value": args?.field_first_name }],
            "field_last_name": [{ "value": args?.field_last_name }],
            "name": [{ "value": args?.name }],
            "mail": [{ "value": args?.mail }],
            "pass": [{ "value": args?.password }],
            "preferred_langcode": [{ "value": language }],
            "preferred_admin_langcode": [{ "value": "en" }],
            "status": [{ "value": "1" }],
            "roles": [{ "target_id": "application_user" }]
        }

        let response: boolean = false;

        try {
            let axiosResponse: AxiosResponse = await axios({
                url: url,
                method: 'POST',
                responseType: 'json',
                headers: { "Content-type": "application/json" },
                timeout: appConfig.apiTimeout,
                auth: {
                    username: appConfig.apiAuthUsername,
                    password: appConfig.apiAuthPassword,
                },
                data: bodyParams
            })

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response = rawResponseJson.status
            }
        } catch (rejectError) {
            if (appConfig.showLog) {
                console.log(rejectError, "reject error");
            }
        }
        return response
    }

    public async drupalLogin(args: DrupalLoginArgs): Promise<boolean> {

        let url = `${appConfig.apiUrl}/user/validate?username=${args.username}&password=${args.password}`
        url = this.addBasicAuthForIOS(url, true);
        let response: boolean =  false 

        try {
            let axiosResponse: AxiosResponse = await axios({
                url: url,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout,
                auth: {
                    username: appConfig.apiAuthUsername,
                    password: appConfig.apiAuthPassword,
                },
            })

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response = rawResponseJson
            }
        } catch (e) {
           throw new Error("Network Error ")
        }
        return response
    }

    public async isApiAvailable(): Promise<true | Error> {
        // URL
        const language = localize.getLanguage();
        let url = `${appConfig.apiUrl}/list-content/${language}`;
        url = this.addBasicAuthForIOS(url);

        // URL params
        const urlParams: any = {
            page: 0,
            numberOfItems: 1,
            published: appConfig.showPublishedContent,
        };

        // Get API response
        try {
            let axiosResponse: AxiosResponse = await axios({
                // API: https://bit.ly/2ZatNfQ
                url: url,
                params: urlParams,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                },
            });

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                return true;
            } else {
                return new Error('API is not available. ' + axiosResponse.statusText);
            }
        } catch (rejectError) {
            return new UnknownError(rejectError);
        }
    }

    public async getContent(args: GetContentArgs): Promise<ContentResponse> {
        // URL
        const language = localize.getLanguage();
        const contentType: string | undefined = args.type;
        let url = `${appConfig.apiUrl}/list-content/${language}${contentType ? `/${contentType}` : ''}`;
        url = this.addBasicAuthForIOS(url);

        // URL params
        const urlParams: any = {};

        urlParams.page = args.page !== undefined ? args.page : 0;
        urlParams.numberOfItems = args.numberOfItems !== undefined ? args.numberOfItems : 10;
        if (args.updatedFromDate !== undefined) {
            urlParams.updatedFromDate = args.updatedFromDate;
        }
        urlParams.published = appConfig.showPublishedContent;

        // Get API response
        let response: ContentResponse = { total: 0, data: [] };
        
        try {
            if (appConfig.showLog) {
                console.log(`apiStore.getContent(): numberOfItems:${urlParams.numberOfItems}, page:${urlParams.page}, type:${contentType ? contentType : 'all'}, updatedFromDate:${urlParams.updatedFromDate}`);
                console.log(`apiStore.getContent(): URL = ${url}`);
                console.log(`apiStore.getContent(): URL params = ${JSON.stringify(urlParams, null, 4)}`);
            }

            let axiosResponse: AxiosResponse = await axios({
                // API: https://bit.ly/2ZatNfQ
                url: url,
                params: urlParams,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                },
            });

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response.total = parseInt(rawResponseJson.total);
                response.data = rawResponseJson.data.map((rawContent: any): ContentEntity => {
                    let contentType = rawContent.type;
                    if (contentType === 'video_article') {
                        contentType = 'article';
                    }

                    return {
                        id: parseInt(rawContent.id),
                        type: contentType,
                        langcode: rawContent.langcode,
                        title: rawContent.title,
                        summary: rawContent.summary,
                        body: rawContent.body,
                        category: parseInt(rawContent.category),
                        predefinedTags: rawContent.predefined_tags ? rawContent.predefined_tags.map((value: any) => parseInt(value)) : [],
                        keywords: rawContent.keywords ? rawContent.keywords.map((value: any) => parseInt(value)) : [],
                        referencedArticles: rawContent.related_articles ? rawContent.related_articles.map((value: any) => parseInt(value)) : [],
                        coverImageUrl: rawContent.cover_image?.url,
                        coverImageAlt: rawContent.cover_image?.alt,
                        coverImageName: rawContent.cover_image?.name,
                        coverVideoUrl: rawContent.cover_video?.url,
                        coverVideoName: rawContent.cover_video?.name,
                        coverVideoSite: rawContent.cover_video?.site,
                        createdAt: new Date(rawContent.created_at * 1000),
                        updatedAt: new Date(rawContent.updated_at * 1000),
                    };
                });
            } else {
                dataRealmStore.setVariable('lastDataSyncError', 'getContent failed, ' + axiosResponse.statusText);
            }
        } catch (rejectError) {
            const netError = new UnknownError(rejectError);
            dataRealmStore.setVariable('lastDataSyncError', 'getContent failed, ' + netError.message);

            if (appConfig.showLog) {
                console.log(rejectError);
            }
        }

        return response;
    }

    public async getAllContent(contentType?: ContentEntityType, updatedFromDate?: number): Promise<ContentResponse> {
        const numberOfItems = appConfig.apiNumberOfItems;

        // Make first request
        let finalContentResponse = await this.getContent({
            type: contentType,
            page: 0,
            numberOfItems: numberOfItems,
            updatedFromDate: updatedFromDate,
        });
        // If all items are returned in first request
        if (finalContentResponse.total <= numberOfItems) {
            if (appConfig.showLog) {
                console.log(`apiStore.getAllContent(): contentType=${contentType ? contentType : 'all'}, updatedFromDate=${updatedFromDate}, total:${finalContentResponse.total}, data length:${finalContentResponse.data?.length}`,);
            }

            return finalContentResponse;
        }

        // Make other requests
        let promises: Promise<any>[] = [];

        for (let page = 1; page < Math.ceil(finalContentResponse.total / numberOfItems); page++) {
            promises.push(this.getContent({
                type: contentType,
                page: page,
                numberOfItems: numberOfItems,
                updatedFromDate: updatedFromDate,
            }));
        }

        let allResponses = await Promise.all<ContentResponse>(promises);

        // Combine all responses
        allResponses.forEach((contentResponse) => {
            finalContentResponse.data = finalContentResponse.data.concat(contentResponse.data);
        });

        if (appConfig.showLog) {
            console.log(`apiStore.getAllContent(): contentType=${contentType ? contentType : 'all'}, updatedFromDate=${updatedFromDate}, total:${finalContentResponse.total}, data length:${finalContentResponse.data?.length}`,);
        }

        return finalContentResponse;
    }

    public async getDailyMessages(args: GetDailyMessagesArgs): Promise<ContentResponse> {
        // URL
        let language = localize.getLanguage();

        let url = `${appConfig.apiUrl}/list-daily-homescreen-message/${language}`;
        url = this.addBasicAuthForIOS(url);

        // URL params
        const urlParams: any = {};

        urlParams.page = args.page !== undefined ? args.page : 0;
        urlParams.numberOfItems = args.numberOfItems !== undefined ? args.numberOfItems : 10;
        if (args.updatedFromDate !== undefined) {
            urlParams.updatedFromDate = args.updatedFromDate;
        }
        urlParams.published = appConfig.showPublishedContent;

        // Get API response
        let response: ContentResponse = { total: 0, data: [] };

        try {
            if (appConfig.showLog) {
                console.log(`apiStore.getDailyMessages(): numberOfItems:${urlParams.numberOfItems}, page:${urlParams.page}, updatedFromDate:${urlParams.updatedFromDate}`);
                console.log(`apiStore.getDailyMessages(): URL = ${url}`);
                console.log(`apiStore.getDailyMessages(): URL params = ${JSON.stringify(urlParams, null, 4)}`);
            }

            let axiosResponse: AxiosResponse = await axios({
                // API: https://bit.ly/2ZatNfQ
                url: url,
                params: urlParams,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                },
            });

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response.total = parseInt(rawResponseJson.total);
                response.data = rawResponseJson.data.map((rawContent: any): DailyMessageEntity => {
                    return {
                        id: parseInt(rawContent.id),
                        langcode: rawContent.langcode,
                        title: rawContent.title,
                        createdAt: new Date(rawContent.created_at * 1000),
                        updatedAt: new Date(rawContent.updated_at * 1000),
                    };
                });
            }
        } catch (rejectError) {
            const netError = new UnknownError(rejectError);
            dataRealmStore.setVariable('lastDataSyncError', 'getDailyMessages failed, ' + netError.message);

            if (appConfig.showLog) {
                console.log(rejectError);
            }
        }

        return response;
    }

    public async getAllDailyMessages(updatedFromDate?: number): Promise<ContentResponse> {
        const numberOfItems = appConfig.apiNumberOfItems;

        // Make first request
        let finalContentResponse = await this.getDailyMessages({
            page: 0,
            numberOfItems: numberOfItems,
            updatedFromDate: updatedFromDate,
        });

        // If all items are returned in first request
        if (finalContentResponse.total <= numberOfItems) {
            if (appConfig.showLog) {
                console.log(`apiStore.getAllDailyMessages(): updatedFromDate=${updatedFromDate}, total:${finalContentResponse.total}, data length:${finalContentResponse.data?.length}`,);
            }

            return finalContentResponse;
        }

        // Make other requests
        let promises: Promise<any>[] = [];

        for (let page = 1; page < Math.ceil(finalContentResponse.total / numberOfItems); page++) {
            promises.push(this.getDailyMessages({
                page: page,
                numberOfItems: numberOfItems,
                updatedFromDate: updatedFromDate,
            }));
        }

        let allResponses = await Promise.all<ContentResponse>(promises);

        // Combine all responses
        allResponses.forEach((contentResponse) => {
            finalContentResponse.data = finalContentResponse.data.concat(contentResponse.data);
        });

        if (appConfig.showLog) {
            console.log(`apiStore.getAllDailyMessages(): updatedFromDate=${updatedFromDate}, total:${finalContentResponse.total}, data length:${finalContentResponse.data?.length}`,);
        }

        return finalContentResponse;
    }

    private getVocabularies(): Vocabulary[] {
        return ['categories', 'keywords', 'predefined_tags'];
    }

    public async getVocabulariesAndTerms(): Promise<VocabulariesAndTermsResponse> {
        const language = localize.getLanguage();
        let vocabularies = this.getVocabularies();

        let response: VocabulariesAndTermsResponse = {
            categories: [],
            keywords: [],
            predefined_tags: [],
        };

        const objectToArray = (obj: any) => {
            const rval: any = [];

            for (let id in obj) {
                let value = obj[id];
                let children = value.children;

                if (!Array.isArray(children)) {
                    children = objectToArray(children);
                }

                rval.push({
                    id: parseInt(id),
                    name: value.name,
                    children: children,
                });
            }

            return rval;
        };

        for (let index in vocabularies) {
            let vocabulary = vocabularies[index];
            let url = `${appConfig.apiUrl}/list-taxonomy/${language}/${vocabulary}`;
            url = this.addBasicAuthForIOS(url);

            try {
                let axiosResponse: AxiosResponse = await axios({
                    // API: https://bit.ly/2ZatNfQ
                    url: url,
                    method: 'GET',
                    responseType: 'json',
                    timeout: appConfig.apiTimeout, // milliseconds
                    maxContentLength: 100000, // bytes
                    auth: {
                        username: appConfig.apiUsername,
                        password: appConfig.apiPassword,
                    },
                });

                // Transform response
                if (axiosResponse.data?.data) {
                    response[vocabulary] = objectToArray(axiosResponse.data.data);
                }
            } catch (rejectError) {
                const netError = new UnknownError(rejectError);
                dataRealmStore.setVariable('lastDataSyncError', 'getVocabulariesAndTerms failed, ' + netError.message);
            }
        }

        if (appConfig.showLog) {
            console.log(`apiStore.getVocabulariesAndTerms(): categories: ${response.categories.length}, keywords: ${response.keywords.length}, predefined_tags: ${response.predefined_tags.length}`);
        }

        return response;
    }

    public async downloadImage(args: ApiImageData): Promise<boolean> {
        let rval: boolean = false;

        try {
            // Create dest folder if it doesn't exist
            if (!(await RNFS.exists(args.destFolder))) {
                await RNFS.mkdir(args.destFolder);
            }

            // Download image: https://bit.ly/2S5CeEu
            let { jobId, promise: downloadPromise } = RNFS.downloadFile({
                fromUrl: args.srcUrl,
                toFile: args.destFolder + `/${args.destFilename}`,
                connectionTimeout: 150 * 1000, // milliseconds
                readTimeout: 150 * 1000, // milliseconds
            });

            let downloadResult = await downloadPromise;

            if (downloadResult.statusCode === 200) {
                if (RNFS.exists(args.destFolder + '/' + args.destFilename)) {
                    rval = true;

                    // if (appConfig.showLog) {
                    //     console.log('IMAGE DOWNLOADED: ', args.destFilename);
                    // }
                }
            } else {
                dataRealmStore.setVariable('lastDataSyncError', 'downloadImage failed, ' + downloadResult.statusCode);

                if (appConfig.showLog) {
                    console.log(`IMAGE DOWNLOAD ERROR: url = ${args.srcUrl}, statusCode: ${downloadResult.statusCode}`);
                }
            }
        } catch (rejectError) {
            const netError = new UnknownError(rejectError);
            dataRealmStore.setVariable('lastDataSyncError', 'downloadImage failed, ' + netError.message);

            if (appConfig.showLog) {
                console.log('IMAGE DOWNLOAD ERROR', rejectError, args.srcUrl);
            }
        }

        return rval;
    }

    public async downloadImages(args: ApiImageData[]): Promise<{ success: boolean, args: ApiImageData }[] | null> {
        let allResponses: any[] = [];
        const numberOfLoops: number = Math.ceil(args.length / appConfig.downloadImagesBatchSize);

        for (let loop = 0; loop < numberOfLoops; loop++) {
            // Get currentLoopImages
            const indexStart = loop * appConfig.downloadImagesBatchSize;
            const indexEnd = loop * appConfig.downloadImagesBatchSize + appConfig.downloadImagesBatchSize;
            const currentLoopImages = args.slice(indexStart, indexEnd);

            // Download current loop images
            const promises: Promise<boolean>[] = [];
            currentLoopImages.forEach((downloadImageArgs) => {
                promises.push(this.downloadImage(downloadImageArgs));
            });

            let loopResponses = await Promise.all<boolean>(promises);

            // Set numberOfSuccess
            const numberOfSuccess = loopResponses.reduce((acc: number, currentValue: boolean) => {
                if (currentValue) return acc + 1; else return acc;
            }, 0);

            // Add responses to allResponses
            allResponses = allResponses.concat(
                loopResponses.map((value, index) => {
                    return {
                        success: value,
                        args: currentLoopImages[index],
                    };
                })
            );

            // Log
            if (appConfig.showLog) {
                console.log(`apiStore.downloadImages() batch ${loop + 1}: Downloaded ${numberOfSuccess} from ${currentLoopImages.length} images`,);
            }

            // Wait between batches
            await utils.waitMilliseconds(appConfig.downloadImagesIntervalBetweenBatches);
        }

        return allResponses;
    }

    private addBasicAuthForIOS(url: string, isLoginRegister: boolean = false): string {
        if (Platform.OS === 'ios') {
            if (isLoginRegister) {
                return url.replace('http://', `http://${appConfig.apiAuthUsername}:${appConfig.apiAuthPassword}@`);
            } else {
                return url.replace('http://', `http://${appConfig.apiUsername}:${appConfig.apiPassword}@`);
            }
        } else {
            return url;
        }
    }

    public async setVariable(key: string, value: any): Promise<boolean> {
        let rval = true;

        let url = `${appConfig.apiUrl}/variable-set`;
        url = this.addBasicAuthForIOS(url);

        try {
            let axiosResponse: AxiosResponse = await axios({
                // API: https://bit.ly/2ZatNfQ
                url: url,
                data: {
                    key: key,
                    data: JSON.stringify(value),
                },
                method: 'POST',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                },
            });

            let rawResponseJson: { status: boolean, message: string } = axiosResponse.data;

            if (!rawResponseJson || !rawResponseJson.status) rval = false;
        } catch (rejectError) {
            rval = false;
            if (appConfig.showLog) {
                console.log(rejectError.message);
            }
        }

        return rval;
    }

    public async getVariable(key: string): Promise<any | null> {
        let rval: any = null;

        let url = `${appConfig.apiUrl}/variable-get/${key}`;
        url = this.addBasicAuthForIOS(url);

        try {
            let axiosResponse: AxiosResponse = await axios({
                // API: https://bit.ly/2ZatNfQ
                url: url,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                },
            });

            let rawResponseJson: { status: boolean, key: string, data: string, message: string } = axiosResponse.data;

            if (rawResponseJson && rawResponseJson.status) {
                rval = JSON.parse(rawResponseJson.data);
            }
        } catch (rejectError) {
            if (appConfig.showLog) console.log(rejectError);
        }

        return rval;
    }

    public async deleteVariable(key: string): Promise<boolean> {
        let rval = true;

        let url = `${appConfig.apiUrl}/variable-delete/${key}`;
        url = this.addBasicAuthForIOS(url);

        try {
            let axiosResponse: AxiosResponse = await axios({
                // API: https://bit.ly/2ZatNfQ
                url: url,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
                auth: {
                    username: appConfig.apiUsername,
                    password: appConfig.apiPassword,
                },
            });

            let rawResponseJson: { status: boolean, message: string } = axiosResponse.data;

            if (!rawResponseJson || !rawResponseJson.status) {
                rval = false;
            }
        } catch (rejectError) {
            rval = false;
            if (appConfig.showLog) console.log(rejectError);
        }

        return rval;
    }
}

export interface BasicPagesResponse {
    total: number,
    data: BasicPageEntity[]
}

export interface DrupalRegisterArgs {
    field_first_name: string,
    field_last_name: string,
    name: string,
    mail: string,
    password: string,
}


export interface DrupalLoginArgs {
    username: string,
    password: string,
}

interface GetContentArgs {
    type?: ContentEntityType;

    /**
     * Defaults to 10
     */
    numberOfItems?: number;

    /**
     * Defaults to 0
     */
    page?: number;

    /**
     * UNIX timestamp
     */
    updatedFromDate?: number;
}

interface GetMilestoneArgs {
    numberOfItems?: number;
    page?: number;
    updatedFromDate?: number;
}



interface GetDailyMessagesArgs {
    /**
     * Defaults to 10
     */
    numberOfItems?: number;

    /**
     * Defaults to 0
     */
    page?: number;

    /**
     * UNIX timestamp
     */
    updatedFromDate?: number;
}

export interface ContentResponse {
    total: number;
    data: ContentEntity[];
}

interface PollsResponse {
    total: number,
    data: PollsEntity[];
}

export interface MilestonesResponse {
    total: number;
    data: MilestoneEntity[];
}

type Vocabulary = 'categories' | 'keywords' | 'predefined_tags';

export type TermChildren = {
    id: number;
    name: string;
    children: TermChildren[];
};

export type VocabulariesAndTermsResponse = {
    [key in Vocabulary]: {
        id: number;
        name: string;
        children: TermChildren[];
    }[];
};

export type ApiImageData = {
    srcUrl: string;
    destFolder: string;
    destFilename: string;
};

export const apiStore = ApiStore.getInstance();