import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo } from '@/lib/types/todo';

/**
 * Interface for paginated API response
 */
interface PaginatedResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Interface for pagination parameters
 */
interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * RTK Query API for todos
 * Handles CRUD operations and caching
 */
export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/'
  }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    /**
     * Get paginated list of todos
     */
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

    /**
     * Get a single todo by ID
     */
    getTodoById: builder.query<Todo, number>({
      query: (id) => `todos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Todos', id }],
    }),

    /**
     * Add a new todo
     */
    addTodo: builder.mutation<Todo, Omit<Todo, 'id'>>({
      query: (todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo,
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        try {
          const { data: savedTodo } = await queryFulfilled;
          // Optimistically update the cache
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

    /**
     * Update an existing todo
     */
    updateTodo: builder.mutation<Todo, Todo>({
      query: (todo) => {
        // For local todos (ID > 200), don't make an API call
        if (todo.id > 200) {
          return {
            url: 'todos/1',
            method: 'PUT',
            body: todo,
            skip: true
          };
        }
        return {
          url: `todos/${todo.id}`,
          method: 'PUT',
          body: todo,
        };
      },
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        try {
          // For local todos, we'll just update the cache directly
          if (todo.id > 200) {
            dispatch(
              todosApi.util.updateQueryData('getTodos', { page: 1, limit: 10 }, (draft) => {
                const index = draft.data.findIndex((t) => t.id === todo.id);
                if (index !== -1) {
                  draft.data[index] = todo;
                }
              })
            );
            return;
          }

          // For regular todos, proceed with the API call
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

    /**
     * Delete a todo
     */
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Optimistically update the cache
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

// Export generated hooks for use in components
export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;