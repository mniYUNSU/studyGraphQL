import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

const schema = buildSchema(`
  type Todo {
    id: ID!
    title: String!
    done: Boolean!
  }
  type Query {
    todos: [Todo]
  }
  type Mutation {
    addTodo(title: String!): Todo
  }
`);

const todos: Todo[] = [
  { id: 1, title: '문서 작성', done: false },
  { id: 2, title: '프로덕션 배포', done: false }
];

const root = {
  todos: (): Todo[] => todos,
  addTodo: ({ title }: { title: string }): Todo => {
    const newTodo: Todo = { id: todos.length + 1, title, done: false };
    todos.push(newTodo);
    return newTodo;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4000, () => {
  console.log('Todo server running on http://localhost:4000/graphql');
});
