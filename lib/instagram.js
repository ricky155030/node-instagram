(function() {
  'use strict';

  var request = require('request');
  var fs      = require('fs');
  var q       = require('q');

  var utils = require('../utils.js');

  function Instagram(param) {
    var param = param || {};

    this._sessionId = param.sessionId;
    this._csrftoken = param.csrftoken;
  };

  Instagram.prototype = {};

  Instagram.prototype._request = function(url, method, option) {
    var self = this;
    var defer = q.defer();
    var option = utils.getPostOption(url, method, self._sessionId, self._csrftoken, option || {});

    request(option, function(err, response, body) {
      if(err) {
        defer.reject("Requset err: " + err);
      }

      try {
        var output = JSON.parse(body);
      } catch(e) {
        return defer.reject("Error: " + e + ", may be not a JSON object");
      }
      
      defer.resolve(output);
    })

    return defer.promise;
  }

  Instagram.prototype._getUserId = function(targetUserName) {
    var self = this;
    var defer = q.defer();

    self.fetchUserInfo(targetUserName).then(function(output) {
      defer.resolve(output.user.id);
    }).fail(function(err) {
      defer.reject(err);
    });
    
    return defer.promise;
  }

  Instagram.prototype.addLike = function(postId) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/web/likes/' + postId + '/like/';

    self._request(url, 'post').then(function(output) {
      defer.resolve(output);
    }).fail(function(err) {
      defer.reject(err);
    })

    return defer.promise;
  }

  Instagram.prototype.addComment = function(postId, text) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/web/comments/' + postId + '/add/';

    self._request(url, 'post', {
      name: 'addComment',
      text: text
    }).then(function(output) {
      defer.resolve(output);
    }).fail(function(err) {
      defer.reject(err);
    })

    return defer.promise;
  };

  Instagram.prototype.fetchUserPost = function(targetUserName, numOfPost) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/query/';

    self._getUserId(targetUserName).then(function(targetUserId) {
      return self._request(url, 'post', {
        name: 'fetchPost',
        targetUserId: targetUserId,
        numOfPost: numOfPost,
      })
    }).then(function(output) {
      defer.resolve(output);
    }).fail(function(err) {
      defer.reject(err);
    })

    return defer.promise;
  };

  Instagram.prototype.fetchTag = function(tag, numOfPost, iteration) {
    var self = this;
    var outerDefer = q.defer();
    var posts = [];
    var count = 0;

    function firstFetch() {
      var innerDefer = q.defer();
      var url = 'https://www.instagram.com/explore/tags/' + encodeURIComponent(tag) + '/?__a=1';

      self._request(url, 'get', {}).then(function(output) {
        var endCursor = output.tag.media.page_info.end_cursor;

        posts = posts.concat(output.tag.media.nodes);
        innerDefer.resolve(endCursor);
      }).fail(function(err) {
        innerDefer.reject(err);
      })

      return innerDefer.promise;
    };
    
    function subFetch(endCursor) {
      var innerDefer = q.defer();
      var url = 'https://www.instagram.com/query/';

      self._request(url, 'post', {
        name: 'fetchTag',
        tag: tag,
        numOfPost: numOfPost,
        endCursor: endCursor
      }).then(function(output) {
        var endCursor = output.media.page_info.end_cursor;
        count++;

        posts = posts.concat(output.media.nodes);

        if(count < iteration) {
          subFetch(endCursor).fail(function(err) {
            outerDefer.reject(err);
          });
        } else {
          outerDefer.resolve(posts);
        }

        innerDefer.resolve(endCursor);
      }).fail(function(err) {
        innerDefer.reject(err);
        outerDefer.reject(err);
      })

      return innerDefer.promise;
    }

    firstFetch().then(function(endCursor) {
      subFetch(endCursor).fail(function(err) {
        console.log(err);
      });
    }).fail(function(err) {
      console.log(err);
    });

    return outerDefer.promise;
  };

  Instagram.prototype.fetchFollower = function(targetUserName, numOfFollower) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/query/';

    self._getUserId(targetUserName).then(function(targetUserId) {
      return self._request(url, 'post', {
        name: 'followedBy',
        targetUserId: targetUserId,
        numOfFollower: numOfFollower,
      })
    }).then(function(output) {
      defer.resolve(output);
    }).fail(function(err) {
      defer.reject(err);
    })

    return defer.promise;
  };

  Instagram.prototype.fetchFollows = function(targetUserName, numOfFollower) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/query/';

    self._getUserId(targetUserName).then(function(targetUserId) {
      return self._request(url, 'post', {
        name: 'follows',
        targetUserId: targetUserId,
        numOfFollower: numOfFollower,
      })
    }).then(function(output) {
      defer.resolve(output);
    }).fail(function(err) {
      defer.reject(err);
    })

    return defer.promise;
  }

  Instagram.prototype.fetchUserInfo = function(targetUserName) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/' + targetUserName + '/?__a=1';

    self._request(url, 'get').then(function(output) {
      defer.resolve(output);
    }).fail(function(err) {
      defer.reject(err);
    })

    return defer.promise;
  }

  Instagram.prototype.fetchPost = function(code) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/p/' + code + '/?__a=1'

    self._request(url, 'get').then(function(output) {
      defer.resolve(output);
    }).fail(function(err) {
      defer.reject(err);
    })

    return defer.promise;
  }

  function login(username, password) {
    var self = this;
    var defer = q.defer();
    var url = 'https://www.instagram.com/accounts/login/ajax/';

    var option = utils.getPostOption(url, 'post', null, null, {
      name: 'login',
      username: username,
      password: password,
    });

    var csrftoken;
    var sessionid;

    request(option, function(err, response, body) {
      if(err) {
        defer.reject("Requset err: " + err);
      }

      var cookies = response.headers['set-cookie'];
      cookies.forEach(function(cookie) {
        var csrftokenMatch = /csrftoken=(.*?);/g.exec(cookie)
        var sessionidMatch = /sessionid=(.*?);/g.exec(cookie)

        if(csrftokenMatch) {
          csrftoken = csrftokenMatch[1];
        }

        if(sessionidMatch) {
          sessionid = sessionidMatch[1];
        }
      })

      try {
        var output = JSON.parse(body);
      } catch(e) {
        return defer.reject("Error: " + e + ", Body: " + body);
      }

      if(output.authenticated === false) {
        defer.reject(output)
      }
      
      if(csrftoken && sessionid) {
        output.csrftoken = csrftoken;
        output.sessionid = sessionid;
        defer.resolve(output);
      } else {
        defer.reject('csrftoken or sessionid is undefined')
      }
    })

    return defer.promise;
  }

  module.exports = {
    Instagram: Instagram,
    login: login
  };

})()
