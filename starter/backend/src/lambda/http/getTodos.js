import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodos } from '../../businessLogic/todos.mjs'
import { getUserId, response } from "../utils.mjs";
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('getTodos');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event);
    const todos = await getTodos(userId);
    logger.info(`Returning ${todos.length} todos`);
    return response(200, { items: todos} );
  });
