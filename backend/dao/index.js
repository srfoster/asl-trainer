// daos.js
const knex = require('./knexfile');

class UsersDAO {
    static findAll() {
        return knex('users').select('*');
    }

    static findById(id) {
        return knex('users').where('id', id).first();
    }

    static create(user) {
        return knex('users').insert(user).returning('*');
    }

    static update(id, user) {
        return knex('users').where('id', id).update(user).returning('*');
    }

    static delete(id) {
        return knex('users').where('id', id).del();
    }
}

class PromptsDAO {
    static findAll() {
        return knex('prompts').select('*');
    }

    static findById(id) {
        return knex('prompts').where('id', id).first();
    }

    static create(prompt) {
        return knex('prompts').insert(prompt).returning('*');
    }

    static delete(id) {
        return knex('prompts').where('id', id).del();
    }
}

class FeedItemsDAO {
    static findAll() {
        return knex('feed_items').select('*');
    }

    static findById(id) {
        return knex('feed_items').where('id', id).first();
    }

    static create(feedItem) {
        return knex('feed_items').insert(feedItem).returning('*');
    }

    static update(id, feedItem) {
        return knex('feed_items').where('id', id).update(feedItem).returning('*');
    }

    static delete(id) {
        return knex('feed_items').where('id', id).del();
    }
}

class AttemptsDAO {
    static findAll() {
        return knex('attempts').select('*');
    }

    static findById(id) {
        return knex('attempts').where('id', id).first();
    }

    static create(attempt) {
        return knex('attempts').insert(attempt).returning('*');
    }

    static delete(id) {
        return knex('attempts').where('id', id).del();
    }
}

class TagsDAO {
    static findAll() {
        return knex('tags').select('*');
    }

    static findById(id) {
        return knex('tags').where('id', id).first();
    }

    static create(tag) {
        return knex('tags').insert(tag).returning('*');
    }

    static delete(id) {
        return knex('tags').where('id', id).del();
    }
}

class FeedItemTagsDAO {
    static findAll() {
        return knex('feed_item_tags').select('*');
    }

    static findByFeedItemId(feedItemId) {
        return knex('feed_item_tags').where('feed_item_id', feedItemId);
    }

    static create(feedItemTag) {
        return knex('feed_item_tags').insert(feedItemTag).returning('*');
    }

    static delete(feedItemId, tagId) {
        return knex('feed_item_tags').where({
            feed_item_id: feedItemId,
            tag_id: tagId
        }).del();
    }
}

class UserRatingsDAO {
    static findAll() {
        return knex('user_ratings').select('*');
    }

    static findByUserIdAndPromptId(userId, promptId) {
        return knex('user_ratings').where({
            user_id: userId,
            prompt_id: promptId
        }).first();
    }

    static create(userRating) {
        return knex('user_ratings').insert(userRating).returning('*');
    }

    static update(userId, promptId, newRating) {
        return knex('user_ratings').where({
            user_id: userId,
            prompt_id: promptId
        }).update({rating: newRating}).returning('*');
    }

    static delete(userId, promptId) {
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
    UserRatingsDAO
};
