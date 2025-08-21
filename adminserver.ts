import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

interface User {
  id: number;
  name: string;
  role: 'USER' | 'ADMIN';
}

const schema = buildSchema(`
  enum Role { USER ADMIN }
  input UserInput { name: String!, role: Role }
  type User { id: ID!, name: String!, role: Role! }
  type Query { users: [User!]!, user(id: ID!): User }
  type Mutation { addUser(input: UserInput!): User! }
`);

const users: User[] = [
  { id: 1, name: 'Alice', role: 'ADMIN' },
  { id: 2, name: 'Bob', role: 'USER' }
];

const root = {
  users: (): User[] => users,
  user: ({ id }: { id: number }): User | undefined =>
    users.find((u) => u.id == id),
  addUser: ({
    input
  }: {
    input: { name: string; role?: 'USER' | 'ADMIN' };
  }): User => {
    const newUser: User = {
      id: users.length + 1,
      name: input.name,
      role: input.role ?? 'USER'
    };
    users.push(newUser);
    return newUser;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.listen(4000, () => console.log('Server at http://localhost:4000/graphql'));
