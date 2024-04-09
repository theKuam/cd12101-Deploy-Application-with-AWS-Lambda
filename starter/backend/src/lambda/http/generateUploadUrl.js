import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { updateAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { getUserId, response } from '../utils.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
  .handler(async (event) => {
    try {
      const todoId = event.pathParameters.todoId;
      const userId = getUserId(event);

      const url = await updateAttachmentPresignedUrl(userId, todoId);

      console.log('Upload URL generated successfully', { userId, todoId });

      // Return a successful response with the generated upload URL
      return response(200, { uploadUrl: url });
    } catch (error) {
      // Log any errors encountered during URL generation
      console.error('Error generating upload URL', { error: error.message });

      // Return an error response
      return response(500, { error: 'Failed to generate upload URL' });
    }
  });