import { Blog } from '../model/blog.interface';
import BlogModel from '../db/Blog.db';

/* eslint-disable class-methods-use-this */
class BlogService {
  async getBlog(id: string): Promise<Blog | null> {
    const blog = await BlogModel.findByPk(id);
    return blog;
  }

  async getBlogs(): Promise<Blog[]> {
    const blogs = await BlogModel.findAll({});
    return blogs;
  }

  async addBlog(blogData: Omit<Blog, 'id' | 'uploadAt'>): Promise<Blog> {
    const blog = await BlogModel.create(blogData);
    return blog;
  }

  async removeBlog(id: string): Promise<void> {
    const blog = await BlogModel.findByPk(id);
    if (!blog) {
      // The blog has already been deleted
      return;
    }

    await blog.destroy();
  }
}
/* eslint-enable class-methods-use-this */

const blogService = new BlogService();
export default blogService;
