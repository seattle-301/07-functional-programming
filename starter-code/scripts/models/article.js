(function(module) {
// DONE: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
  function Article (opts) {
    for (key in opts) {
      this[key] = opts[key];
    }
  }

  Article.allArticles = [];

  Article.prototype.toHtml = function(scriptTemplateId) {
    var template = Handlebars.compile($(scriptTemplateId).text());
    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);
    return template(this);
  };

  Article.loadAll = function(inputData) {
    /* DONE: the original forEach code should be refactored
       using `.map()` -  since what we are trying to accomplish is the
       transformation of one collection into another. */
    Article.allArticles = inputData.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    }).map(function(ele) {
      return new Article(ele);
    });
  };

  /* DONE: Refactoring the Article.fetchAll method, it now accepts a parameter
      that will execute once the loading of articles is done. We do this because
      we might want to call other view functions, and not just renderIndexPage();
      Now instead of calling articleView.renderIndexPage(), we can call
      whatever we pass in! */
  Article.fetchAll = function(next) {
    if (localStorage.hackerIpsum) {
      $.ajax({
        type: 'HEAD',
        url: '/data/hackerIpsum.json',
        success: function(data, message, xhr) {
          var eTag = xhr.getResponseHeader('eTag');
          if (!localStorage.eTag || eTag !== localStorage.eTag) {
            // DONE: pass 'next' into Article.getAll();
            Article.getAll(next);
          } else {
            Article.loadAll(JSON.parse(localStorage.hackerIpsum));
            // DONE: invoke next
            next();
          }
        }
      });
      Article.getAll(next);
      // DONE: pass 'next' into getAll();
    } else {
    }
  };

  Article.getAll = function(next) {
    $.getJSON('/data/hackerIpsum.json', function(responseData, message, xhr) {
      localStorage.eTag = xhr.getResponseHeader('eTag');
      Article.loadAll(responseData);
      localStorage.hackerIpsum = JSON.stringify(responseData);
      // DONE invoke our parameter.
      next();
    });
  };

  Article.numWordsAll = function() {
    return Article.allArticles.map(function(currentArticle) {
      return currentArticle.body.match(/\w+/g).length;
      // alternate: return currentArticle.body.split(' ').length;
    }).reduce(function(prev, cur) {
      return prev + cur;
    });
  };

  Article.allAuthors = function() {
    return Article.allArticles.map(function(curArticle) {
      return curArticle.author;
    }).reduce(function(acc, cur) {
      if (acc.indexOf(cur) === -1) {
        acc.push(cur);
      }
      return acc;
    }, []);
  };

  Article.numWordsByAuthor = function() {
    return Article.allAuthors().map(function(currentAuthor) {
      return {
        name: currentAuthor,
        numWords: Article.allArticles.filter(function(curArticle) {
          return curArticle.author === currentAuthor;
        }).map(function(curArticle) {
          return curArticle.body.match(/\w+/g).length;
        }).reduce(function(prev, cur) {
          return prev + cur;
        })
      };
    });
  };

  module.Article = Article;
})(window);
