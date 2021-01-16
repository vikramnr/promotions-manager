var mongoose = require("mongoose");

var promotionSchema = new mongoose.Schema({
    name: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    createdAt: { type: Date, default: Date.now },
    endDate: {type: Date },
    costPrice: Number,
    sellingPrice: Number,
    marginLost: Number,
    share: Number,
    supplierShare: Number,
    status: String,
    product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reference"
    }

});

module.exports = mongoose.model("Promo", promotionSchema);