const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuShema = Schema({
    title: String,
    url: String,
    order: Number,
    active: Boolean
});

module.exports = mongoose.model('Menu', MenuShema);