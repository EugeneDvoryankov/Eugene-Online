import {
  expect,
  test,
  describe,
} from 'vitest';
import SuperTest from 'supertest';

import app from '../../src/start';
import { Blog } from '../../src/model/blog.interface';
import blogService from '../../src/service/blog.db.service';
import { adminAuthorizationHeader, authorizationHeader } from '../setupFile';

const request = SuperTest(app);

describe('The blog router', () => {
  const blogTestData: Omit<Blog, 'id' | 'uploadAt'> = {
    title: 'This is a blog',
    content: 'Read what this has to say',
  };

  describe('get blogs', () => {
    const getRequest = () => request
      .get('/api/blogs');

    test('it should return 200 with an empty array if there are no blogs', async () => {
      const res = await getRequest();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    test('it should return 200 with an array of blogs', async () => {
      // Add a blog, the array should now include that blog
      await blogService.addBlog(blogTestData);

      const res = await getRequest();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            title: blogTestData.title,
            content: blogTestData.content,
            uploadAt: expect.anything(),
          }),
        ]),
      );
    });
  });

  describe('get blog', () => {
    const getRequest = (id: string) => request
      .get(`/api/blogs/${id}`);

    test('it should return 404 if a blog with id does not exist', async () => {
      // Id that does not exist
      const id = '20b84031-288a-41e8-9dac-17e1e0eaf45d';

      const res = await getRequest(id);

      expect(res.statusCode).toBe(404);
    });

    test('it should return 200 with the blog', async () => {
      const addedBlog = await blogService.addBlog(blogTestData);

      const res = await getRequest(addedBlog.id);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: addedBlog.id,
          title: blogTestData.title,
          content: blogTestData.content,
          uploadAt: expect.anything(),
        }),
      );
    });
  });

  describe('create blog', () => {
    const createRequest = (data?: string | object | undefined) => request
      .post('/api/blogs')
      .set('Authorization', adminAuthorizationHeader)
      .send(data);

    test('it should return 401 if the user is not authenticated', async () => {
      const res = await request
        .post('/api/blogs')
        .send(blogTestData);

      expect(res.statusCode).toBe(401);
    });

    test('it should return 403 if the user is not an admin', async () => {
      const res = await request
        .post('/api/blogs')
        .set('Authorization', authorizationHeader)
        .send(blogTestData);

      expect(res.statusCode).toBe(403);
    });

    test('it should return 400 if any property is excluded', async () => {
      const { title, ...excludingTitle } = blogTestData;
      const typeRes = await createRequest(excludingTitle);
      expect(typeRes.statusCode).toBe(400);

      const { content, ...excludingContent } = blogTestData;
      const yearRes = await createRequest(excludingContent);
      expect(yearRes.statusCode).toBe(400);
    });

    test('it should return 201 with the created blog', async () => {
      const res = await createRequest(blogTestData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          title: blogTestData.title,
          content: blogTestData.content,
          uploadAt: expect.anything(),
        }),
      );
      expect(res.headers.location).toBe(`/api/blogs/${res.body.id}`);
    });
  });

  describe('delete blog', () => {
    const deleteRequest = (id: string) => request
      .delete(`/api/blogs/${id}`)
      .set('Authorization', adminAuthorizationHeader);

    test('it should return 401 if the user is not authenticated', async () => {
      const blog = await blogService.addBlog(blogTestData);

      const res = await request
        .delete(`/api/blogs/${blog.id}`);

      expect(res.statusCode).toBe(401);
    });

    test('it should return 403 if the user is not an admin', async () => {
      const blog = await blogService.addBlog(blogTestData);

      const res = await request
        .delete(`/api/blogs/${blog.id}`)
        .set('Authorization', authorizationHeader);

      expect(res.statusCode).toBe(403);
    });

    test('it should return 400 if id is not uuid', async () => {
      // Id should be UUID but is number as string
      const id = '1';

      const res = await deleteRequest(id);

      expect(res.statusCode).toBe(400);
    });

    test('it should return 200 even if the blog with id does not exist', async () => {
      // Id that does not exist
      const id = 'a7fbc56a-fca8-4ea7-a85b-dd4e8dad6236';

      const res = await deleteRequest(id);

      expect(res.statusCode).toBe(200);
    });

    test('it should return 200 and the blog should be removed', async () => {
      const blog = await blogService.addBlog(blogTestData);

      const res = await deleteRequest(blog.id);

      expect(res.statusCode).toBe(200);
      const blogs = await blogService.getBlogs();
      expect(blogs).toHaveLength(0);
    });
  });
});
