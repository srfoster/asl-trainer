// daos.js
const knex = require('./knexfile');

class Importer {

  static async importFeedItem(item){
    console.log("Importing...",item)

    let producerImport = item.producer
   
    let producer = (await UsersDAO.findByUsername(producerImport.username))

    console.log("Producer found?", producer)

    if(!producer){
       console.log("Creating producer", producerImport)
       await UsersDAO.create(producerImport)
       producer = await UsersDAO.findByUsername(producerImport.username) 
    }

    delete item["producer"]

    let category = await CategoriesDAO.findByCategoryName(item.category) 

    if(!category){
       await CategoriesDAO.create({name: item.category})
    }

    delete item["category"]
    delete item["type"]

    await FeedItemsDAO.create({...item, producer_id: producer.id, answer_options: item.answer_options.join("$$$$$")}) 
     
  }
}

class UsersDAO {
    static async findAll() {
        return knex('users').select('*');
    }

    static async findById(id) {
        return await knex('users').where('id', id).first();
    }

    static async findByUsername(username) {
        console.log("Looking for user with name", username)
        let ret = await knex('users').where('username', username).first();
        console.log("Awaited", ret)

			  return ret
    }

    static async create(user) {
        console.log("Creating user", user)
        return knex('users').insert(user);
    }

    static async update(id, user) {
        return knex('users').where('id', id).update(user).returning('*');
    }

    static async delete(id) {
        return knex('users').where('id', id).del();
    }
}

class CategoriesDAO {
    static async findAll() {
        return knex('categories').select('*');
    }

    static async findById(id) {
        return await knex('categories').where('id', id).first();
    }

    static async findByCategoryName(name) {
        return await knex('categories').where('name', name).first();
    }

    static async create(category) {
        return knex('categories').insert(category).returning('*');
    }

    static async delete(id) {
        return knex('categories').where('id', id).del();
    }
}

class FeedItemsDAO {
    static async findAll() {
        return knex('feed_items').select('*');
    }

    static async findById(id) {
        return knex('feed_items').where('id', id).first();
    }

    static async create(feedItem) {
        return knex('feed_items').insert(feedItem).returning('*');
    }

    static async update(id, feedItem) {
        return knex('feed_items').where('id', id).update(feedItem).returning('*');
    }

    static async delete(id) {
        return knex('feed_items').where('id', id).del();
    }
}

class AttemptsDAO {
    static async findAll() {
        return knex('attempts').select('*');
    }

    static async findById(id) {
        return knex('attempts').where('id', id).first();
    }

    static async create(attempt) {
        return knex('attempts').insert(attempt).returning('*');
    }

    static async delete(id) {
        return knex('attempts').where('id', id).del();
    }
}


class TagsDAO {
    static async findAll() {
        return knex('tags').select('*');
    }

    static async findById(id) {
        return knex('tags').where('id', id).first();
    }

    static async create(tag) {
        return knex('tags').insert(tag).returning('*');
    }

    static async delete(id) {
        return knex('tags').where('id', id).del();
    }
}

class FeedItemTagsDAO {
    static async findAll() {
        return knex('feed_item_tags').select('*');
    }

    static async findByFeedItemId(feedItemId) {
        return knex('feed_item_tags').where('feed_item_id', feedItemId);
    }

    static async create(feedItemTag) {
        return knex('feed_item_tags').insert(feedItemTag).returning('*');
    }

    static async delete(feedItemId, tagId) {
        return knex('feed_item_tags').where({
            feed_item_id: feedItemId,
            tag_id: tagId
        }).del();
    }
}

class UserRatingsDAO {
    static async findAll() {
        return knex('user_ratings').select('*');
    }

    static async create(userRating) {
        return knex('user_ratings').insert(userRating).returning('*');
    }

    static async update(userId, promptId, newRating) {
        return knex('user_ratings').where({
            user_id: userId,
            prompt_id: promptId
        }).update({rating: newRating}).returning('*');
    }

    static async delete(userId, promptId) {
        return knex('user_ratings').where({
            user_id: userId,
            prompt_id: promptId
        }).del();
    }
}

module.exports = {
    UsersDAO,
    FeedItemsDAO,
    AttemptsDAO,
    TagsDAO,
    FeedItemTagsDAO,
    UserRatingsDAO,
    Importer,
};
