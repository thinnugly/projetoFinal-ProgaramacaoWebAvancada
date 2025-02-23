require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
module.exports = {
    mongodb: {
        uri: MONGO_URI,
        collections: {
            user: 'users',
            task: 'tasks',
            comment: 'comments',
            notifcation: 'notfications'
        }
    },
    auth: {
        expiration_time: 15000,
        issuer: 'FCA'
    },
    sanitize: {
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËẼÌÍÎÏĨÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëẽìíîïĩðñòóôõöøùúûüýÿ\\ ',
        numerical: '0123456789'
    },
    email: {
        service: 'Gmail',
        auth: {
            user: '',
            pass: ''
        }
    }
}