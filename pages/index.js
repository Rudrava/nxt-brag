import toast from "react-hot-toast";
import { firestore, postToJSON, fromMillis } from "../lib/fireBase";
import { useEffect, useState } from "react";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";
import MetaTags from "../components/MetaTags";

const LIMIT = 5;
export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  return { props: { posts } };
}

export default function Home(props) {
  useEffect(() => props.posts.length <= 1 && setPostEnd(true), []);
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postEnd, setPostEnd] = useState(false);
  const getMorePosts = async () => {
    setLoading(true);

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;
    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = await (await query.get()).docs.map((doc) => doc.data());
    setPosts(posts.concat(newPosts));
    setLoading(false);
    if (newPosts.length > LIMIT) {
      setPostEnd(true);
    }
  };
  return (
    <main>
      <MetaTags
        title="brag"
        desc="a site to brag bout achievements"
        image={
          "https://lh3.googleusercontent.com/a-/AOh14GgGZVO6nXfXVHbR-kiLYeUk_yjf6D3IOeSObPoiIQ=s96-c"
        }
      />
      <PostFeed posts={posts} />
      {!loading && !postEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader show={loading} />
      {postEnd && "No more posts"}
    </main>
  );
}
