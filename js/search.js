var post = '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-4 post-preview"> \
<div class="inner" style="background-image: url({{post_image}});"> \
  <div class="row top"> \
    <div class="col-lg-12"> \
      <h2 class="post-title"><a href="{{post_permalink}}">{{post_title}}</a></h2> \
      <p class="post-subtitle">{{post_subtitle}}</p> \
    </div> \
  </div> \
  <div class="row tags"> \
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-right"> \
      <ul class="list-inline"> \
        {{tags}} \
      </ul> \
    </div> \
  </div> \
  <div class="row bottom"> \
    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">by {{post_sauthor}} \
      <a href="http://www.twitter.com/{{ post.twitter }}" class="post-twitter"><img src="/img/twitter.png" alt="{{post_author}} Twitter account"></a> \
    </div> \
    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right">{{post_date}}</div> \
  </div>\
</div></div>';

$(function() {
  var existing = null;
  $('.search-query').keydown(function() {
    var that = this;
    $.getJSON("/metadata.json", function(data) {
      var string = $(that).val();
      var values = [];
      $.each(data, function(key, value) {
        if (value.title.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
          values.push(key)
        }
      });

      if (values.length > 0) {
        if (existing == null) {
          existing = $('.posts .post-preview').detach();
        } else {
          $('.posts').empty();
        }

        $.each(values, function(key) {
          var obj = data[key];
          $('.posts').append($(post).replace('{{post_title}}', obj.title));
        });
      }
    });
  });
});