import { TodoAccess } from "../dataLayer/todoAccess.mjs";
import * as uuid from 'uuid';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('todos');
const todoAccess = new TodoAccess();

export async function getTodos(userId) {
    try {
        logger.info("Getting todos: ", { userId });
        return await todoAccess.getTodos(userId);
    } catch (e) {
        logger.error("Error getting todos: ", { userId, e });
        throw e;
    }
}

export async function createTodo(userId, createTodoRequest) {
    try {
        logger.info("Creating todo: ", { userId, createTodoRequest });
        const todoId = uuid.v4();

        return await todoAccess.createTodo({
            userId,
            todoId: todoId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false,
            attachmentUrl: null
        });
    } catch (e) {
        logger.error("Error creating todo: ", { userId, createTodoRequest, e });
        throw e;
    }
}

export async function updateTodo(userId, todoId, updatedTodo) {
    try {
        logger.info("Updating todo: ", { userId, todoId, updatedTodo });
        return await todoAccess.updateTodo(userId, todoId, updatedTodo);
    } catch (e) {
        logger.error("Error updating todo: ", { userId, todoId, updatedTodo, e });
        throw e;
    }
}

export async function deleteTodo(userId, todoId) {
    try {
        logger.info("Deleting todo: ", { userId, todoId });
        return await todoAccess.deleteTodo(userId, todoId);
    } catch (e) {
        logger.error("Error deleting todo: ", { userId, todoId, e });
        throw e;
    }
}

export async function updateAttachmentPresignedUrl(userId, todoId) {
    try {
        logger.info("Updating attachment presigned url: ", { userId, todoId });
        return await todoAccess.updateAttachmentPresignedUrl(userId, todoId);
    } catch (e) {
        logger.error("Error updating attachment presigned url: ", { userId, todoId, e });
        throw e;
    }
}
