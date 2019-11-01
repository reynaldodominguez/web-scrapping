var mongoose =  require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
      },
      link: {
        type: String,
        required: true
      },
      date: {
        type: String,
        required: true
      },
      resume: {
        type: String,
        required: true
      }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;