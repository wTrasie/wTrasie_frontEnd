import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SEARCH, GET_SEARCH_TYPE } from 'gql';
import {
  ResData,
} from '../uxu-utils/libs/design-system/src/lib/components/organisms/form/search/component.search.types';

const resInitialState: { data: ResData, query: string } = { data: [], query: '' };

export const useHookSearch = () => {
  const [query, setQuery] = useState('');
  const [res, setRes] = useState(resInitialState);
  const { loading, error, data, refetch } = useQuery<GET_SEARCH_TYPE>(GET_SEARCH, { variables: { query: '' } });

  useEffect(() => {
setTimeout(() =>     refetch({ query }), 1000)
  }, [query]);

  console.log(res)

  useEffect(() => {
    let newRes = resInitialState;
    newRes.query = query;
    data?.search?.articles?.data.map((art) => {
      newRes.data.push({
        title: art.attributes.title,
        slug: '',
        cover: null,
      });
    });
    setRes(newRes);
  }, [data, query]);


  return { setQuery, res };
};
