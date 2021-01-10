var mongoose = require("mongoose");

var promoStatusSchema = mongoose.Schema({
    status: String,
    createdAt:{type: Date, default: Date.now}
});

module.exports = mongoose.model("PromoStatus", promoStatusSchema);