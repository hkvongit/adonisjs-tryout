import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from '../../Models/Post'

export default class PostsController {
  public async index() {
    return await Post.all()
  }

  public async store(ctx: HttpContextContract) {
    const { auth, request, response } = ctx

    const authVerifiedUser = await auth.use('basic').authenticate()

    const post = new Post()
    post.post = request.body().post

    // auth verified user is a data modal + data instance from the users table
    await authVerifiedUser?.related('posts').save(post)
    return response.json(post)
  }

  public async show(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    return await Post.find(id)
  }

  public async destroy(ctx: HttpContextContract) {
    const { request, bouncer, auth } = ctx
    const id = request.param('id')
    const post = await Post.findOrFail(id)

    // You need to verify user here before calling the bouncer, otherwise the bouncer will not get the auth user/
    await auth.use('basic').authenticate()
    //The user is inferred from the currently logged-in user. Hence there is no need to pass the user explicitly in bouncer.
    await bouncer.authorize('destroyPost', post)
    return await post.delete()
  }
}
