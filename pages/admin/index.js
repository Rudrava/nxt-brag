import AuthCheck from "../../components/AuthCheck";
import styles from "../../styles/Admin.module.css";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth, serverTimeStamp, firestore } from "../../lib/fireBase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import { kebabCase } from "lodash";
import toast from "react-hot-toast";

const AdminPage = (props) => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

export default AdminPage;

const PostList = (props) => {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapShot] = useCollection(query);

  const posts = querySnapShot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage all your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};
const CreateNewPost = (props) => {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  // ensure slug to url
  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# Hello World",
      createdAt: serverTimeStamp(),
      updatedAt: serverTimeStamp(),
      heartCount: 0,
    };
    await ref.set(data);
    toast.success("Post Created");
    router.push("/admin/" + slug);
  };
  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="the awesome post"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong>
        {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn btn-green">
        Create New Post
      </button>
    </form>
  );
};
