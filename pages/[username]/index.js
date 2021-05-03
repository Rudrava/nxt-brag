import { getUserWithUsername, postToJSON } from "../../lib/fireBase";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import Head from "next/head";

export async function getServerSideProps({ query }) {
  // query is a object with username in it as we made the file as [username ]
  const { username } = query;
  // JSON serializable data
  const userDoc = await getUserWithUsername(username);

  // if no user found
  if (!userDoc) return { notFound: true };

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}
const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
