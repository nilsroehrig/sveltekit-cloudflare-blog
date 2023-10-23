import { z } from 'zod';

export const ProspectivePost = z.object({
    title: z.string(),
    content: z.string(),
    published: z.preprocess(
        (value) => (value instanceof Date ? value : new Date(String(value))),
        z.date()
    ),
    author: z.string()
});
export type ProspectivePost = z.infer<typeof ProspectivePost>;
export const Post = ProspectivePost.extend({
    id: z.string(),
});
export type Post = z.infer<typeof Post>;
