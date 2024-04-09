import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
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
    const userId = getUserId(event);
    const todo = await createTodo(userId, newTodo);
    return response(201, { item: todo });
  });

