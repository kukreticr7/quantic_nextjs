import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo } from '@/lib/types/todo';

interface PaginatedResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/'
  }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<PaginatedResponse, PaginationParams>({
      query: () => 'todos',
      transformResponse: (response: Todo[], meta, arg) => {
        const { page = 1, limit = 10 } = arg;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = response.slice(startIndex, endIndex);

        return {
          data: paginatedData,
          total: response.length,
          page,
          limit,
        };
      },

    }),
    getTodoById: builder.query<Todo, number>({
      query: (id) => `todos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Todos', id }],
    }),
    addTodo: builder.mutation<Todo, Omit<Todo, 'id'>>({
      query: (todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo,
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        try {
          const { data: savedTodo } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData('getTodos', { page: 1, limit: 10 }, (draft) => {
              draft.data.unshift(savedTodo);
              draft.total += 1;
            })
          );
        } catch {
          // If the mutation fails, the cache will be automatically rolled back
        }
      },
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
    }),
    updateTodo: builder.mutation<Todo, Todo>({
      query: (todo) => ({
        url: `todos/${todo.id}`,
        method: 'PUT',
        body: todo,
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTodo } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData('getTodos', { page: 1, limit: 10 }, (draft) => {
              const index = draft.data.findIndex((t) => t.id === todo.id);
              if (index !== -1) {
                draft.data[index] = updatedTodo;
              }
            })
          );
        } catch {
          // If the mutation fails, the cache will be automatically rolled back
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Todos', id }],
    }),
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData('getTodos', { page: 1, limit: 10 }, (draft) => {
              draft.data = draft.data.filter((todo) => todo.id !== id);
              draft.total -= 1;
            })
          );
        } catch {
          // If the mutation fails, the cache will be automatically rolled back
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Todos', id }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;