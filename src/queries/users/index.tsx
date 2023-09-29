import { useQuery, useMutation, UseMutationResult, UseQueryResult, useQueryClient } from 'react-query';
import { User } from './types';
import api from '../../api';

const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get(`/users`);
  return response.data;
};

const createUser = async (newUser: User): Promise<User> => {
  const response = await api.post(`/users`, newUser);
  return response.data;
};

const readUser = async (id: number): Promise<User | null> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

const updateUser = async (id: number, updatedUser: User): Promise<User | null> => {
  const response = await api.put(`/users/${id}`, updatedUser);
  return response.data;
};

export const useUsers = (): UseQueryResult<User[], unknown> => {
  return useQuery('users', fetchUsers, {
    refetchOnMount: false
  });
};

export const useCreateUser = (): UseMutationResult<User, unknown, User> => {
  const queryClient = useQueryClient();

  return useMutation(createUser, {
    onSettled: (updatedData, error) => {
      if (!error) {
        queryClient.setQueryData<User[]>('users', (prevData) => {
          const newData = [...(prevData as User[]), updatedData as User];
          return newData;
        });
      }
    },
  });
};

export const useReadUser = (id: number): UseQueryResult<User | null, unknown> => {
  return useQuery(['asset', id], () => readUser(id), {
    enabled: !!id,
  });
};


export const useUpdateUser = (): UseMutationResult<User | null, unknown, { id: number; data: User }> => {
  const queryClient = useQueryClient();

  return useMutation(({ id, data }: { id: number; data: User }) => updateUser(id, data), {
    onSettled: (updatedData, error) => {
      if (!error) {
        queryClient.setQueryData<User[] | undefined>('users', (prevData) => {
          const updatedUser = prevData?.map((assetItem) => {
            if (assetItem.id === updatedData?.id) {
              assetItem = updatedData
            }

            return assetItem;
          });
          return updatedUser;
        });
      }
    },
  });
}; 
