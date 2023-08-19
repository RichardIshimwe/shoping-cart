'use client'

// export default function home() {

// return (
//   <div>
//     hello home
//   </div>
// )

// }
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { GetTodoListQuery, Todo } from '../client/generated/graphql';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContent />
    </QueryClientProvider>
  );
}

function MainContent() {
  const [allTodo, setAllTodo] = useState([]);
  const { data, isLoading, isError, error } = useQuery<GetTodoListQuery>('todos', async () => {
    const response = await fetch('https://organic-sailfish-94.hasura.app/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'Q4p2iDWwgyXv5DOr0GwkgX3PIDAvacfZitH9zD1TLClg0oFpO082NEyTulzeKHx9',
      },
      body: JSON.stringify({
        query: `
          query GetTodoList {
            Todo {
              id
              name
              task
            }
          }
        `,
      }),
    });

    const { data } = await response.json();
    setAllTodo(data.Todo);
    console.log("these are the data:", data);
    return data.Todo; // Access the 'Todo' array from the GraphQL response
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {isError}</div>; // Display the error message
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ... */}
      <div>
        <h2>Todos</h2>
        <ul>
          {allTodo.map((todo: Todo) => (
            <li key={todo.id}>
              <p>Name: {todo.name}</p>
              <p>Task: {todo.task}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
