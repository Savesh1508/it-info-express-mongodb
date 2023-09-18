const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
    {
        category_name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        parent_category_id: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    {
        versionKey: false,
    }
);

// STATICS
categorySchema.statics.findByName = function(name){
    return this.find({name: new RegExp(name, "i")});
}

// QUERY HELPERS
categorySchema.query.byName = function(name){
    return this.where({name: new RegExp(name, "i")});
}

module.exports = model('Category', categorySchema);