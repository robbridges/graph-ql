const Subscription = {
  comment: {
    subscribe(parent, args, {db, pubsub}, info) {
      const post = db.posts.find((post) => post.id === args.postId && post.published);
      
      if (!post) {
        throw new Error('Post not found, have you checked the id and that hte post is published?');
      }

      

      return pubsub.asyncIterator(`comment ${args.postId}`);
    }
  },
  post: {
    subscribe(parent, args, {pubsub}, info) {
      return pubsub.asyncIterator('post');
    }
  }
}

export default Subscription;