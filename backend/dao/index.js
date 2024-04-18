// daos.js
const knex = require('./knexfile');

class Importer {
   /*

{
  title: 'Alphabet Practice'
  clip: 'https://asl-trainer.s3.us-west-1.amazonaws.com/clips/Alphabet/g.mp4',
  answerOptions: [ 'G', 'V', 'F', 'A' ],
  arrangement: 'grid',
  randomizeOptions: true,
  correctAnswer: 'G',
  type: 'MultipleChoiceFeedItem',
  producer: {
    username: 'lalahep',
    profile_pic_url: 'https://asl-trainer.s3.us-west-1.amazonaws.com/profile-pics/laura.png'
  },
}

   */

  static async importFeedItem(item){
    console.log(item)

    let producerImport = item.producer
   
    let producer = await UsersDAO.findByUsername(producerImport.username) 

    if(!producer){
       await UsersDAO.create(producerImport)
       producer = await UsersDAO.findByUsername(producerImport.username) 
    }

    let prompt = await PromptDAO.findByPromptText(item.prompt) 

    if(!prompt){
       await PromptDAO.create({prompt_text: item.prompt})
       prompt = await PromptDAO.findByPromptText(item.prompt) 
    }

    FeedItemsDAO.create({...item, prompt_id: prompt.id, producer_id: producer.id, answer_options: item.answer_options.join("$$$$$")}) 

     
  }
}

class UsersDAO {
    static async findAll() {
        return knex('users').select('*');
    }

    static async findById(id) {
        return knex('users').where('id', id).first();
    }

    static async findByUsername(username) {
        return knex('users').where('username', username).first();
    }

    static async create(user) {
        return knex('users').insert(user).returning('*');
    }

    static async update(id, user) {
        return knex('users').where('id', id).update(user).returning('*');
    }

    static async delete(id) {
        return knex('users').where('id', id).del();
    }
}

class PromptsDAO {
    static async findAll() {
        return knex('prompts').select('*');
    }

    static async findById(id) {
        return knex('prompts').where('id', id).first();
    }

    static async create(prompt) {
        return knex('prompts').insert(prompt).returning('*');
    }

    static async delete(id) {
        return knex('prompts').where('id', id).del();
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

class PromptDAO {
    static async findAll() {
        return knex('prompts').select('*');
    }

    static async findById(id) {
        return knex('prompts').where('id', id).first();
    }

    static async findByPromptText(text) {
        return knex('prompts').where('prompt_text', text).first();
    }

    static async create(prompt) {
        return knex('prompts').insert(prompt).returning('*');
    }

    static async delete(id) {
        return knex('prompts').where('id', id).del();
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

    static async findByUserIdAndPromptId(userId, promptId) {
        return knex('user_ratings').where({
            user_id: userId,
            prompt_id: promptId
        }).first();
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
    PromptsDAO,
    FeedItemsDAO,
    AttemptsDAO,
    TagsDAO,
    FeedItemTagsDAO,
    UserRatingsDAO,
    Importer,
};
