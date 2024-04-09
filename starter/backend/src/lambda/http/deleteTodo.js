import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId, response } from "../utils.mjs";

export const handler = middy()
.use(httpErrorHandler())
.use(
  httpCors({
    credentials: true
  })
)
.handler(async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const deletedTodo = await deleteTodo(userId, todoId);
  return response(204, { deleteTodo: deletedTodo });
});