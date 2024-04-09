import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('todoAccess');
const url_expiration = process.env.SIGNED_URL_EXPIRATION;

export class TodoAccess {
    constructor(
        dynamoDb = DynamoDBDocument.from(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        todosIndex = process.env.TODOS_CREATED_AT_INDEX,
        S3 = new S3Client({ region: process.env.REGION }),
        s3_bucket_name = process.env.ATTACHMENTS_S3_BUCKET
    ) {
        this.dynamoDb = dynamoDb;
        this.S3 = S3;
        this.todosTable = todosTable;
        this.todosIndex = todosIndex;
        this.bucket_name = s3_bucket_name;
    }

    async getTodos(userId) {
        logger.info("Getting todos: ", { userId });

        const result = await this.dynamoDb.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        });
        return result.Items;
    }

    async createTodo(todo) {
        logger.info("Creating todo: ", { todo });
        try {
            await this.dynamoDb.put({
                TableName: this.todosTable,
                Item: todo
            });
            return todo;
        } catch (e) {
            logger.error("Error creating todo: ", { todo, e });
            throw e;
        }
    }

    async updateTodo(userId, todoId, updatedTodo) {
        logger.info("Updating todo: ", { userId, todoId, updatedTodo });
        try {
            await this.dynamoDb.update({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId
                },
                UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
                ExpressionAttributeValues: {
                    ':name': updatedTodo.name,
                    ':dueDate': updatedTodo.dueDate,
                    ':done': updatedTodo.done
                },
                ExpressionAttributeNames: {
                    '#name': 'name',
                    '#dueDate': 'dueDate',
                    '#done': 'done'
                },
                ReturnValues: 'UPDATED_NEW'
            });
            return updatedTodo;
        } catch (e) {
            logger.error("Error updating todo: ", { userId, todoId, updatedTodo, e });
            throw e;
        }
    }

    async deleteTodo(userId, todoId) {
        logger.info("Deleting todo: ", { userId, todoId });
        try {
            await this.dynamoDb.delete({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId
                }
            });
            return todoId;
        } catch (e) {
            logger.error("Error deleting todo: ", { userId, todoId, e });
            throw e;
        }
    }

    async updateAttachmentPresignedUrl(userId, todoId) {
        logger.info("Updating attachment presigned url: ", { userId, todoId });
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket_name,
                Key: todoId,
            });
            const url = await getSignedUrl(this.S3, command, {
                    expiresIn: parseInt(url_expiration)
                });

            await this.dynamoDb.update({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId
                },
                UpdateExpression: 'set attachmentUrl = :url',
                ExpressionAttributeValues: {
                    ':url': url.split('?')[0]
                },
                ReturnValues: 'UPDATED_NEW'
            });

            return url;
        } catch (e) {
            logger.error("Error updating attachment presigned url: ", { userId, todoId, e });
            console.error("Error getting attachment URL: ", { todoId, e });
            throw e;
        }
    }
}