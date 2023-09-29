import { useQuery, useMutation, UseMutationResult, UseQueryResult, useQueryClient } from 'react-query';
import { Workorders } from './types';
import api from '../../api';

const URL = '/workorders'

const fetchWorkorders = async (): Promise<Workorders[]> => {
  const response = await api.get(URL);
  return response.data;
};

const createWorkorders = async (newWorkorders: Workorders): Promise<Workorders> => {
  const response = await api.post(URL, newWorkorders);
  return response.data;
};

const readWorkorders = async (id: number): Promise<Workorders | null> => {
  const response = await api.get(`/workorders/${id}`);
  return response.data;
};

const updateWorkorders = async (id: number, updatedWorkorders: Workorders): Promise<Workorders | null> => {
  const response = await api.put(`/workorders/${id}`, updatedWorkorders);
  return response.data;
};

export const useWorkorders = (): UseQueryResult<Workorders[], unknown> => {
  return useQuery('workorders', fetchWorkorders, {
    refetchOnMount: false
  });
};


export const useCreateWorkorders = (): UseMutationResult<Workorders, unknown, Workorders> => {
  const queryClient = useQueryClient();

  return useMutation(createWorkorders, {
    onSettled: (updatedData, error) => {
      if (!error) {
        queryClient.setQueryData<Workorders[]>('workorders', (prevData) => {
          const newData = [...(prevData as Workorders[]), updatedData as Workorders];
          return newData;
        });
      }
    },
  });
};

export const useReadWorkorders = (id: number): UseQueryResult<Workorders | null, unknown> => {
  return useQuery(['workorders', id], () => readWorkorders(id), {
    enabled: !!id,
  });
};


export const useUpdateWorkorders = (): UseMutationResult<Workorders | null, unknown, { id: number; data: Workorders }> => {
  const queryClient = useQueryClient();

  return useMutation(({ id, data }: { id: number; data: Workorders }) => updateWorkorders(id, data), {
    onSettled: (updatedData, error) => {
      if (!error) {
        queryClient.setQueryData<Workorders[] | undefined>('workorders', (prevData) => {
          const updatedWorkorders = prevData?.map((assetItem) => {
            if (assetItem.id === updatedData?.id) {
              assetItem = updatedData
            }

            return assetItem;
          });
          return updatedWorkorders;
        });
      }
    },
  });
}; 
