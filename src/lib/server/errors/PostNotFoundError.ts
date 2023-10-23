export class PostNotFoundError extends Error {
    name = "PostNotFoundError";

    constructor(postId: string, errorOptions?: ErrorOptions) {
        super(`Post with id ${postId} not found`, errorOptions);
    }
}