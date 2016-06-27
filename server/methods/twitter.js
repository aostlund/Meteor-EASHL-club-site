import StreamTweets from 'stream-tweets';

Meteor.methods({
    getTweets() {
      console.log('getting Tweets');
      Meteor.http.call('GET', "http://bombers-hockey.com/tweets.json").data.forEach((data) => {
        if (!Tweets.findOne({id: data.id})) {
          console.log('added tweet');
          Tweets.insert(data);
        }
      })
    },
    getTweets2() {
      TWITTERKEYS = {consumer_key: process.env.TW_CONSUMER_KEY,
                     consumer_secret: process.env.TW_CONSUMER_SECRET,
                     token: process.env.TW_TOKEN,
                     token_secret: process.env.TW_TOKEN_SECRET};
      console.log(TWITTERKEYS);
      console.log(StreamTweets);
      let following = ['50004938', '33936681', '25660180'];
      var st = new StreamTweets(TWITTERKEYS, false);
      st.stream({follow: following}, Meteor.bindEnvironment(function(result) {
        console.log(result);
        console.log(result.text);
        if (following.indexOf(result.user.id.toString()) != -1 && !result.in_reply_to_user_id) {
          console.log('new tweet');
            if (!Tweets.findOne({id: result.id})) {
              Tweets.insert(result);
              console.log('added');
            }
            console.log('already exists');
        }
        console.log(`user ${result.user.name} reply: ${result.in_reply_to_user_id}`);
      }, function(e) { throw e; }));
    },
    checkTweets(idx) {
      Tweets.find({}, {sort: {id: -1}}, {limit: 5}).forEach((data, index) => {
        if (idx == index) {
          console.log(data);
        }
      });
    }
})