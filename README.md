# Node Instagram Api

Retrieve media without official instagram api support. (Based on promise)

## Install with npm

```
npm install node-instagram-api
```


## Login

You need to fill CSRFTOKEN and SESSIONID later.
```
$ node login                                                                                                                                                                               <<<
Username: example
Password: 
```

If success, you will get
```
{ status: 'ok',
  authenticated: true,
  user: 'example',
  csrftoken: '<YOUR CSRFTOKEN>',
  sessionid: '<YOUR SESSIONID>' }
```

## API Reference

### new Instagram(params)

```
var nodeInstagram = require('node-instagram');

var ig = new nodeInstagram.Instagram({
  sessionId: '<YOUR SESSIONID HERE>',
  csrftoken: '<YOUR CSRFTOKEN HERE>'
})
```

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>String</code> | your instagram session id |
| csrftoken | <code>String</code> | your instagram csrftoken |

### fetchUserPost(id, numOfPost) => <code>Promise</code>

```
ig.fetchUserPost('fumeancat', 5).then(function(output) {
  console.log(output.media.nodes)
}).fail(function(err) {
  console.log(err)
}); 
```

### ig.fetchTag(tag, numOfPost, iterations) => <code>Promise</code>

```
ig.fetchTag('台南', 12, 1).then(function(output) {
  console.log(output)
}).fail(function(err) {
  console.log(err)
});
```

### ig.fetchPost(code) => <code>Promise</code>

```
ig.fetchPost('BGQ3dhCEK73').then(function(output) {
  console.log(output.media.likes.nodes)
}).fail(function(err) {
  console.log(err)
});
```

### ig.addComment(postId, comment) => <code>Promise</code>

Add a comment to a post.

```
ig.addComment('1261997285197436496', 'Test').then(function(output) {
  console.log(output)
}).fail(function(err) {
  console.log(err)
});
```

### ig.addLike(postId) => <code>Promise</code>

Send like to a post.

```
ig.addLike('1262841227841807675').then(function(output) {
  console.log(output)
}).fail(function(err) {
  console.log(err)
});
```

### ig.fetchUserInfo(username) => <code>Promise</code>

```
ig.fetchUserInfo('fumeancat').then(function(output) {
  console.log(output);
}).fail(function(err) {
  console.log(err);
})
```

### ig.fetchFollower(username, numOfFollower) => <code>Promise</code>

Get follower of a user.

```
ig.fetchFollower('fumeancat', 999).then(function(output) {
  console.log(output.followed_by.nodes);
}).fail(function(err) {
  console.log(err);
})
```

### ig.fetchFollows(username, numOfFollower) => <code>Promise</code>

Get user follows.

```
ig.fetchFollows('fumeancat', 999).then(function(output) {
  console.log(output.follows.nodes);
}).fail(function(err) {
  console.log(err);
})
```
