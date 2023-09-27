import { useQuery, useMutation, UseMutationResult, UseQueryResult } from 'react-query';
import { User } from './types';
import api from '../../api';

const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get(`/users`);
  return response.data;
};

const createUser = async (newUser: string): Promise<User> => {
  const response = await api.post(`/users`, newUser);
  return response.data;
};

const readUser = async (id: number): Promise<User | null> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

const updateUser = async (id: number, updatedUser: string): Promise<User | null> => {
  const response = await api.put(`/users/${id}`, updatedUser);
  return response.data;
};

const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const useUsers = (): UseQueryResult<User[], unknown> => {
  return useQuery('users', fetchUsers, {
    refetchOnMount: false
  });
};

export const useCreateUser = (): UseMutationResult<User, unknown, string> => {
  return useMutation(createUser, {
    onSuccess: () => {
    },
  });
};

export const useReadUser = (id: number): UseQueryResult<User | null, unknown> => {
  return useQuery(['asset', id], () => readUser(id), {
    enabled: !!id,
  });
};


export const useUpdateUser = (): UseMutationResult<User | null, unknown, { id: number; data: string }> => {
  return useMutation(({ id, data }: { id: number; data: string }) => updateUser(id, data), {
    onSuccess: () => {
    },
  });
};


export const useDeleteUser = (): UseMutationResult<void, unknown, number> => {
  return useMutation(deleteUser, {
    onSuccess: () => {
    },
  });
};
