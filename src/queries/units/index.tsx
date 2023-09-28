import { useQuery, useMutation, UseMutationResult, UseQueryResult } from 'react-query';
import { Unit } from './types';
import api from '../../api';

const fetchUnits = async (): Promise<Unit[]> => {
  const response = await api.get(`/units`);
  return response.data;
};

const createUnit = async (newUnit: Unit): Promise<Unit> => {
  const response = await api.post(`/units`, newUnit);
  return response.data;
};

const readUnit = async (id: number): Promise<Unit | null> => {
  const response = await api.get(`/units/${id}`);
  return response.data;
};

const updateUnit = async (id: number, updatedUnit: Unit): Promise<Unit | null> => {
  const response = await api.put(`/units/${id}`, updatedUnit);
  return response.data;
};

const deleteUnit = async (id: number): Promise<void> => {
  await api.delete(`/units/${id}`);
};

export const useUnits = (): UseQueryResult<Unit[], unknown> => {
  return useQuery('units', fetchUnits, {
    refetchOnMount: false
  });
};


export const useCreateUnit = (): UseMutationResult<Unit, unknown, Unit> => {
  return useMutation(createUnit, {
    onSuccess: () => {

    },
  });
};

export const useReadUnit = (id: number): UseQueryResult<Unit | null, unknown> => {
  return useQuery(['asset', id], () => readUnit(id), {
    enabled: !!id,
  });
};


export const useUpdateUnit = (): UseMutationResult<Unit | null, unknown, { id: number; data: Unit }> => {
  return useMutation(({ id, data }: { id: number; data: Unit }) => updateUnit(id, data), {
    onSuccess: () => {

    },
  });
};


export const useDeleteUnit = (): UseMutationResult<void, unknown, number> => {
  return useMutation(deleteUnit, {
    onSuccess: () => {

    },
  });
};
