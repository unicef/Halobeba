import { ContentEntity } from "./ContentEntity";

/**
 * Category with articles used by views.
 */
export class CategoryArticlesViewEntity {
    categoryId: number = 0;
    categoryName: string = '';
    articles: ContentEntity[] = [];
}