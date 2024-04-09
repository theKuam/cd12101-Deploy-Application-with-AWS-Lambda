import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId, response } from "../utils.mjs";

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body);
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const updatedTodo = await updateTodo(userId, todoId, newTodo);
    return response(200, { updatedTodo: updatedTodo });
  });
