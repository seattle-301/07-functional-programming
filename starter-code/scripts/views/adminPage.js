articleView.renderAdminPage = function() {
  var statsRender = Handlebars.compile($('#stats-template').html());
  
  $('#blog-stats .articles').text(Article.allArticles.length);
  $('#blog-stats .words').text(Article.numWordsAll());
  Article.numWordsByAuthor().forEach(function(numWordsObj) {
    $('.author-stats').append(statsRender(numWordsObj));
  });

};

Article.fetchAll(articleView.renderAdminPage);
