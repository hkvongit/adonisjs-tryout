import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from '../../Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UserController {
  public async index() {
    const users = await User.all()
    return users
  }

  public async login(ctx: HttpContextContract) {
    const { email, password } = ctx.request.body()
    const user = await User.findBy('email', email)
    if (user) {
      if (await Hash.verify(user.password, password)) {
        return user
      }
    }
    return ctx.response.status(401).json({ message: 'Invalid Credentials' })
  }

  public async store(ctx: HttpContextContract) {
    const user = new User()
    const newUserSchema = schema.create({
      email: schema.string(),
      name: schema.string(),
      password: schema.string(),
    })
    const validatedData = await ctx.request.validate({ schema: newUserSchema })
    await user.fill(validatedData).save()
  }

  public async show(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    return await User.find(id)
  }

  public async destroy(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const user = await User.findOrFail(id)
    return await user.delete()
  }
}
