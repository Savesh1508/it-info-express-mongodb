const { Schema, model } = require('mongoose');

const dictionarySchema = new Schema(
    {
        term: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        letter: {
            type: String,
            uppercase: true
        },
    },
    {
        versionKey: false,
    }
);

// STATICS
dictionarySchema.statics.findByTerm = function(term){
    return this.find({term: new RegExp(term, "i")});
}

dictionarySchema.statics.findByLetter = function(letter){
    return this.find({letter: new RegExp(letter, "i")});
}

// QUERY HELPERS
dictionarySchema.query.byTerm = function(term){
    return this.where({term: new RegExp(term, "i")});
}

dictionarySchema.query.byLetter = function(letter){
    return this.where({letter: new RegExp(term, "i")});
}

module.exports = model('Dictionary', dictionarySchema);