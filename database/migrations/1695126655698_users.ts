import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected userTableName = 'users'
  protected postTableName = 'posts'

  public async up() {
    this.schema.createTable(this.userTableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.createTable(this.postTableName, (table) => {
      table.uuid('id').primary()
      table.string('post').notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE') // delete post when user is deleted

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.userTableName)
    this.schema.dropTable(this.postTableName)
  }
}
