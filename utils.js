(function() {

  'use stricts'

  var staticData = {
    fetchPost: function(option) {
      return [{
                "name": "q",
                "value": " \
                ig_user(" + option.targetUserId + ") { media.after(0, " + option.numOfPost + ") { \
                  count, \
                  nodes { \
                    caption, \
                    caption_is_edited, \
                    code, \
                    comments.last(100) { \
                      count, \
                      nodes { \
                        user { \
                          username \
                }, \
                text, \
                created_at \
                } \
                }, \
                date, \
                dimensions { \
                  height, \
                  width \
                }, \
                display_src, \
                id, \
                is_video, \
                likes { \
                  count, \
                  nodes { \
                    user { \
                      username \
                } \
                } \
                }, \
                owner { \
                  id \
                }, \
                thumbnail_src, \
                video_url, \
                video_views \
                }, \
                page_info \
                } \
                }"
              },
              {
                "name": "ref",
                "value": "users::show"
              }];
    },
    fetchTag: function(option) {
      return [{
                "name": "q",
                "value": " \
                  ig_hashtag(" + option.tag + ") { media.after(" + option.endCursor + ", " + option.numOfPost + ") { \
                    count, \
                    nodes { \
                      caption, \
                      code, \
                      comments { \
                        count \
                      }, \
                      date, \
                      dimensions { \
                        height, \
                        width \
                      }, \
                      display_src, \
                      id, \
                      is_video, \
                      likes { \
                        count \
                      }, \
                      owner { \
                        id \
                      }, \
                      thumbnail_src, \
                      video_views \
                    }, \
                    page_info \
                  } \
                }"
              },
              {
                "name": "ref",
                "value": "users::show"
              }];
    },
    addComment: function(option) {
      return [{
        "name": "comment_text",
        "value": option.text
      }]  
    },
    followedBy: function(option) {
      return [{
        "name": "q",
        "value": " \
          ig_user(" + option.targetUserId + ") { \
          followed_by.first(" + option.numOfFollower + ") { \
            count, \
            page_info { \
              end_cursor, \
              has_next_page \
            }, \
            nodes { \
              id, \
              is_verified, \
              followed_by_viewer, \
              requested_by_viewer, \
              full_name, \
              profile_pic_url, \
              username \
            } \
          } \
        }"
      },
      {
        "name": "ref",
        "value": "relationships::follow_list"
      }];
    },
    follows: function(option) {
      return [{
        "name": "q",
        "value": " \
          ig_user(" + option.targetUserId + ") { \
          follows.first(" + option.numOfFollower + ") { \
            count, \
            page_info { \
              end_cursor, \
              has_next_page \
            }, \
            nodes { \
              id, \
              is_verified, \
              followed_by_viewer, \
              requested_by_viewer, \
              full_name, \
              profile_pic_url, \
              username \
            } \
          } \
        }"
      },
      {
        "name": "ref",
        "value": "relationships::follow_list"
      }];
    },
    login: function(option) {
      return [{
        "name": "username",
        "value": option.username
      },
      {
        "name": "password",
        "value": option.password
      }];
    }
  }


  function getPostOption(url, method, sessionId, csrftoken, option) {
    var postOption = {
      har: {
        url   : url,
        method: method,
        gzip: true,
        headers: [{
            name: 'origin',
            value: 'https://www.instagram.com'
          },
          {
            name: 'content-type',
            value: 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          {
            name: 'accept',
            value: 'application/json, text/javascript, */*; q=0.01'
          },
          {
            name: 'referer',
            value: 'https://www.instagram.com/'
          },
          {
            name: 'x-csrftoken', 
            value: csrftoken
        }],
        cookies: [
          {
          "name": "sessionid",
          "value": sessionId,
          "expires": null,
          "httpOnly": false,
          "secure": false
        },
        {
          "name": "csrftoken",
          "value": csrftoken,
          "expires": null,
          "httpOnly": false,
          "secure": false
        },
        ],
        postData: {
          "mimeType": "application/x-www-form-urlencoded; charset=UTF-8",
          "params": []
        }
      }
    }

    if(option.name) {
      postOption.har.postData.params = staticData[option.name](option)
    }

    // console.log(postOption.har.postData.params);

    return postOption;
  }

  module.exports = {
    getPostOption: getPostOption
  }

})()
