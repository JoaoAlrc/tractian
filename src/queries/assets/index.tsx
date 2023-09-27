import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { Asset } from './types';
import api from '../../api';


const URL = '/assets'

const fetchAssets = async (): Promise<Asset[]> => {
  const response = await api.get(URL);
  return response.data;
};


const updateAsset = async (id: number, updatedAsset: Asset): Promise<Asset | null> => {
  const response = await api.put(`${URL}/${id}`, updatedAsset);
  return response.data;
};

export const useAssets = (): UseQueryResult<Asset[], unknown> => {
  return useQuery('assets', fetchAssets, {
    refetchOnMount: false
  });
};

export const useUpdateAsset = (): UseMutationResult<Asset | null, unknown, { id: number; data: Asset }> => {
  const queryClient = useQueryClient();

  const updateProperties = (source: Record<string, any>, target: Record<string, any>) => {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
          updateProperties(source[key], target[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  };

  return useMutation(({ id, data }: { id: number; data: Asset }) => updateAsset(id, data), {
    onSettled: (updatedData, error) => {
      if (!error) {
        queryClient.setQueryData<Asset[] | undefined>('assets', (prevData) => {
          const updatedAssets = prevData?.map((assetItem) => {
            if (assetItem.id === updatedData?.id) {
              updateProperties(updatedData, assetItem);
            }

            return assetItem;
          });
          return updatedAssets;
        });
      }
    },
  });
};
