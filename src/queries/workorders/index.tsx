import { useQuery, useMutation, UseMutationResult, UseQueryResult } from 'react-query';
import { Workorders } from './types';
import api from '../../api';

const URL = '/workorders'

const fetchWorkorders = async (): Promise<Workorders[]> => {
  const response = await api.get(URL);
  return response.data;
};

const createWorkorders = async (newWorkorders: string): Promise<Workorders> => {
  const response = await api.post(URL, newWorkorders);
  return response.data;
};

const readWorkorders = async (id: number): Promise<Workorders | null> => {
  const response = await api.get(`/workorders/${id}`);
  return response.data;
};

const updateWorkorders = async (id: number, updatedWorkorders: string): Promise<Workorders | null> => {
  const response = await api.put(`/workorders/${id}`, updatedWorkorders);
  return response.data;
};

const deleteWorkorders = async (id: number): Promise<void> => {
  await api.delete(`/workorders/${id}`);
};

export const useWorkorders = (): UseQueryResult<Workorders[], unknown> => {
  return useQuery('workorders', fetchWorkorders, {
    refetchOnMount: false
  });
};


export const useCreateWorkorders = (): UseMutationResult<Workorders, unknown, string> => {
  return useMutation(createWorkorders, {
    onSuccess: () => {
      
    },
  });
};

export const useReadWorkorders = (id: number): UseQueryResult<Workorders | null, unknown> => {
  return useQuery(['asset', id], () => readWorkorders(id), {
    enabled: !!id, 
  });
};


export const useUpdateWorkorders = (): UseMutationResult<Workorders | null, unknown, { id: number; data: string }> => {
  return useMutation(({ id, data }: { id: number; data: string }) => updateWorkorders(id, data), {
    onSuccess: () => {
      
    },
  });
};


export const useDeleteWorkorders = (): UseMutationResult<void, unknown, number> => {
  return useMutation(deleteWorkorders, {
    onSuccess: () => {
      
    },
  });
};
