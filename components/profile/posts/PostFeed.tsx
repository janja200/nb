"use client"
import usePosts from '@/hooks/profile/usePosts';
import PostItem from './PostItem';

interface PostFeedProps {
  userId?: string;
  profile?:boolean;
}

const PostFeed: React.FC<PostFeedProps> = ({ userId,profile }) => {
  const { data: posts = [] } = usePosts(userId,profile);
  
  return (
    <>
      {posts.map((post: Record<string, any>,) => (
        <PostItem userId={userId} key={post.id} data={post} profile={profile}/>
      ))}
    </>
  );
};

export default PostFeed;
