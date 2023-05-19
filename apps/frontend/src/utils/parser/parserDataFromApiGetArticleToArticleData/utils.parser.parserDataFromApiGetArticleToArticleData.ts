import { GetArticleQuery } from 'gql';
import type { ArticleDataType } from 'uxu-utils';
import { ContentPartTypeEnum, createSlug } from 'uxu-utils';
import { createSlugForType } from '../../function';
import { GetDataTypes, ParserDataForArticleTypes } from './utils.parser.parserDataFromApiGetArticleToArticleData.types';
import { Enum_Article_Type } from "../../../gql/types/api-gateway.service.generated";

export class ParserDataFromApiGetArticleToArticleData {
  isLoading: boolean;
  canonicalURL: string;
  getArticleData: GetArticleQuery;
  data: ArticleDataType;

  constructor ( {getArticleData, isLoading = false, canonicalURL}: {
    getArticleData: GetArticleQuery;
    canonicalURL: string;
    isLoading?: boolean
  } ) {
    this.isLoading = isLoading;
    this.canonicalURL = canonicalURL;
    this.getArticleData = getArticleData;
    this.data = {};
  }

  parserDataForArticle ( content?: GetArticleQuery ) {
    if ( !content ) return null;
    this.data = {
      pageID: 'wtrasie',
      id: content?.article?.data.id,
      type: content?.article?.data.attributes.type,
      title: content?.article?.data?.attributes?.title,
      lead: content?.article?.data?.attributes?.lead?.lead,
      createdAt: content?.article?.data?.attributes?.createdAt,
      canonicalURL: this.canonicalURL,
      cover: {
        src: content?.article?.data?.attributes?.cover?.data?.attributes?.url,
        caption: content?.article?.data?.attributes?.cover?.data?.attributes?.caption,
        alt: content?.article?.data?.attributes?.cover?.data?.attributes?.alternativeText,
      },
      author: {
        name: content?.article?.data?.attributes?.author?.data?.attributes?.username,
        avatar: {
          src: content?.article?.data?.attributes?.author?.data?.attributes?.avatar?.data?.attributes?.url,
          caption: content?.article?.data?.attributes?.author?.data?.attributes?.avatar?.data?.attributes?.caption,
          alt: content?.article?.data?.attributes?.author?.data?.attributes?.avatar?.data?.attributes?.alternativeText,
        },
      },
      tags:
        content?.article?.data?.attributes.tags?.data?.map ( tag => ({
          title: tag?.attributes?.title,
          slug: `${createSlugForType ( 'tag' )}/${tag.id}/${createSlug ( tag.attributes.title )}`,
        }) ) || [],
      stats: {ratings: 0, comments: 0, views: 0},

      contentparts: content?.article?.data?.attributes?.contentparts?.map ( ( content, i ) => {
        const data = {
          id: `${i}`,
        };

        switch (content?.__typename) {
          case 'ComponentContentPartsTxt':
            data[ 'id' ] = content?.id || `${i}`;
            data[ 'value' ] = content?.txt;
            data[ 'type' ] = ContentPartTypeEnum.PARAGRAPH;
            break;
          case 'ComponentContentPartsYoutube':
            data[ 'id' ] = content?.id || `${i}`;
            data[ 'url' ] = content?.url;
            data[ 'type' ] = ContentPartTypeEnum.EMBEDYOUTUBE;
            break;
          case 'ComponentContentPartsQuote':
            data[ 'id' ] = content?.id || `${i}`;
            data[ 'value' ] = content?.quote;
            data[ 'type' ] = ContentPartTypeEnum?.QUOTE;
            break;
          case 'ComponentContentPartsMedia':
            data[ 'id' ] = content?.id || `${i}`;
            data[ 'type' ] = ContentPartTypeEnum.IMG;

            content?.media?.data?.attributes?.url && (data[ 'src' ] = content?.media?.data?.attributes?.url);
            content?.media?.data?.attributes?.caption && (data[ 'caption' ] = content.media.data.attributes.caption);
            content?.media?.data?.attributes?.alternativeText && (data[ 'alt' ] = content.media.data.attributes.alternativeText);
            break;
        }

        return data;
      } ),
    };
  }

  getData (): GetDataTypes {
    this.parserDataForArticle ( this?.getArticleData );

    return {
      data: this?.data,
      isLoading: this?.isLoading,
    };
  }
}
