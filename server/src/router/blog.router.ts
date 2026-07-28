import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import validate from '../middlewares/validate';
import authenticate from '../middlewares/authenticate';
import blogService from '../service/blog.db.service';
import { Blog } from '../model/blog.interface';

const blogRouter = express.Router();

blogRouter.get(
  '/',
  async (
    req: Request,
    res: Response<Blog[] | string>,
  ) => {
    try {
      const blogs = await blogService.getBlogs();
      return res.status(200).json(blogs);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log('e', e, e.message);
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

blogRouter.get(
  '/:id',
  validate([
    param('id').isUUID(4),
  ]),
  async (req: Request<{ id: string }>, res: Response<Blog | string>) => {
    try {
      const blog = await blogService.getBlog(req.params.id);
      if (blog === null) {
        return res.status(404).send('Blog with id does not exist');
      }

      return res.status(200).json(blog);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

blogRouter.post(
  '/',
  authenticate({ admin: true }),
  validate([
    body('title').isString(),
    body('content').isString(),
  ]),
  async (
    req: Request<Record<string, any> | undefined, Blog | string, Omit<Blog, 'id' | 'updatedAt'>>,
    res: Response<Blog | string>,
  ) => {
    try {
      try {
        // Take userId from req.user
        const blog = await blogService.addBlog(req.body);
        res.location(`/api/blogs/${blog.id}`);
        return res.status(201).json(blog);
      } catch (error) {
        console.log('Add blog error', error);
        return res.status(400).send('Could not add blog');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

blogRouter.delete(
  '/:id',
  authenticate({ admin: true }),
  validate([
    param('id').isUUID(4),
  ]),
  async (req: Request<{ id: string }>, res: Response<string>) => {
    try {
      const blog = await blogService.getBlog(req.params.id);
      if (!blog) {
        // The blog was already deleted
        return res.status(200).end();
      }

      try {
        await blogService.removeBlog(req.params.id);
        return res.status(200).end();
        // eslint-disable-next-line
      } catch (error) {
        return res.status(400).send('Could not delete blog');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

export default blogRouter;
