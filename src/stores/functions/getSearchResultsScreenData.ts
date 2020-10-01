import { SearchResultsScreenDataResponse, dataRealmStore } from "../dataRealmStore"
import { ContentEntity } from "..";
import { ContentEntitySchema } from "../ContentEntity";
import { TermChildren, VocabulariesAndTermsResponse } from "../apiStore";
import { ChildGender } from "../ChildEntity";
import { userRealmStore } from "../userRealmStore";


export function getSearchResultsScreenData(searchTerm: string): SearchResultsScreenDataResponse {
    const rval: SearchResultsScreenDataResponse = {
        articles: [],
        faqs: [],
    };

    const oppositeChildGenderTagId = getOppositeChildGender();

    let allArticlesCollection: ContentEntity[] = [];

    const allContent = dataRealmStore.realm?.objects<ContentEntity>(ContentEntitySchema.name);

    const vocabulariesAndTerms = dataRealmStore?.getVariable('vocabulariesAndTerms');

    // get all ids for keywords and predefined tags
    const allKeywordsIds = getTagIdsForSearchTerm(vocabulariesAndTerms, "keywords", searchTerm);
    const allPredefinteTagsIds = getTagIdsForSearchTerm(vocabulariesAndTerms, "predefinedTags", searchTerm);

    // get collections
    const titleAndBodyCollection = allContent?.
        filtered(`(body CONTAINS[c] '${searchTerm}' OR title CONTAINS[c] '${searchTerm}')`)
        .filter(item => item.predefinedTags.indexOf(4756) === -1)
        .filter(article => oppositeChildGenderTagId && article.predefinedTags.indexOf(oppositeChildGenderTagId) === -1);

    const keywordsCollection = allContent?.
        filter(record => {
            return record.keywords.filter(x => allKeywordsIds?.includes(x)).length !== 0;
        })
        .filter(item => item.predefinedTags.indexOf(4756) === -1)
        .filter(record => oppositeChildGenderTagId && record.predefinedTags.indexOf(oppositeChildGenderTagId) === -1)

    const predefinedTagsCollection = allContent?.
        filter(record => {
            return record.predefinedTags.filter(x => allPredefinteTagsIds?.includes(x)).length !== 0;
        })
        .filter(item => item.predefinedTags.indexOf(4756) === -1)
        .filter(record => oppositeChildGenderTagId && record.predefinedTags.indexOf(oppositeChildGenderTagId) === -1)


    // Remove duplicates and add to allCollection
    titleAndBodyCollection?.forEach(item => {
        let check = isIdExistInArray(allArticlesCollection, item.id);
        if (!check) {
            allArticlesCollection.push(item)
        };
    });

    keywordsCollection?.forEach(item => {
        let check = isIdExistInArray(allArticlesCollection, item.id);
        if (!check) {
            allArticlesCollection.push(item)
        };
    });

    predefinedTagsCollection?.forEach(item => {
        let check = isIdExistInArray(allArticlesCollection, item.id);
        if (!check) {
            allArticlesCollection.push(item)
        };
    });

    // get child age ids 
    const childAgeTags = formatChildAgeIds();

    let finalArticlesResult: ContentEntity[] = [];

    // sort articles for child age 
    childAgeTags.forEach(ageId => {
        let filteredAgeArticles = allArticlesCollection.filter(item => item.predefinedTags.indexOf(ageId.id) !== -1);

        filteredAgeArticles.forEach(article => {
            let articleAlreadyAdded = isIdExistInArray(finalArticlesResult, article.id);
            if (!articleAlreadyAdded) finalArticlesResult.push(article);
        });
    });

    // sort child age non set articles
    allArticlesCollection.forEach(item => {
        let articleAlreadyAdded = isIdExistInArray(finalArticlesResult, item.id);
        if (!articleAlreadyAdded) {
            finalArticlesResult.push(item)
        };
    });

    // get faq articles
    const categorizedArticles: SearchResultsScreenDataCategoryArticles[] = [];

    // move articles in category 
    vocabulariesAndTerms?.categories.forEach((category) => {
        let currentCategorizedArticles = sortArticlesByCategory(finalArticlesResult, category.id, category.name)
        if (currentCategorizedArticles.contentItems.length > 0) {
            categorizedArticles.push(currentCategorizedArticles);
        };
    });

    // get FAQ articles 
    const faqArticles: ContentEntity[] = finalArticlesResult.filter(faqItem => faqItem.type === 'faq');

    rval.articles = categorizedArticles;
    rval.faqs = faqArticles

    return rval;
};


/**
 * Get ids if search value exist in string 
 * of keywords or predefined tags 
 */
function getTagIdsForSearchTerm(vocabulariesAndTerms: VocabulariesAndTermsResponse | null, type: "keywords" | "predefinedTags", searchTerm: string) {
    let listForFiltering = type === "keywords" ? vocabulariesAndTerms?.keywords : vocabulariesAndTerms?.predefined_tags;

    return listForFiltering?.
        filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(item => item.id);
}

function getOppositeChildGender() {
    let childGender: ChildGender | undefined = userRealmStore.getChildGender();
    let oppositeChildGender: ChildGender | undefined = undefined;

    if (childGender) oppositeChildGender = childGender === 'boy' ? 'girl' : 'boy';

    let oppositeChildGenderTagId: number | undefined = undefined;

    if (oppositeChildGender) {
        oppositeChildGenderTagId = oppositeChildGender === 'boy' ? 40 : 41;
    };

    return oppositeChildGenderTagId;
};

/*
*   Return list of ids starting from current id 
*/
function formatChildAgeIds() {
    const currentChildAgeTag = dataRealmStore.getChildAgeTagWithArticles(null, undefined, true);

    // Get childAgeTags
    let childAgeTags: TermChildren[] = dataRealmStore.getChildAgeTags(true);

    // Reorder childAgeTags
    if (currentChildAgeTag) {
        let indexOfTag = 0;

        childAgeTags.forEach((value, index) => {
            if (value.id === currentChildAgeTag.id) {
                indexOfTag = index;
            }
        });

        if (indexOfTag !== 0) {
            let deletedElements = childAgeTags.splice(indexOfTag);
            childAgeTags = deletedElements.concat(childAgeTags);
        }
    }

    return childAgeTags;
}

/*
*   Return true if article with given id already exist in given array 
*/
function isIdExistInArray(data: ContentEntity[], id: number): boolean {
    return data.find(value => value.id === id) === undefined ? false : true;
}

/*
*   Return object with sorted data by category 
*/
function sortArticlesByCategory(articles: ContentEntity[], categoryId: number, categoryName: string): SearchResultsScreenDataCategoryArticles {
    const currentCategorizedArticles: SearchResultsScreenDataCategoryArticles = {
        categoryId: categoryId,
        categoryName: categoryName,
        contentItems: [],
    };

    articles.forEach((article) => {
        if (article.category === categoryId) {
            currentCategorizedArticles.contentItems.push(article);
        }
    });

    return currentCategorizedArticles;
}



export type SearchResultsScreenDataCategoryArticles = {
    categoryId: number,
    categoryName: string,
    contentItems: ContentEntity[]
};