import styles from "../../styles/Posts.module.css";
import PostContent from "../../components/PostContent";
import Metatags from "../../components/Metatags";
import { UserContext } from "../../lib/context";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/fireBase";

import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";

import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useContext } from "react";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);
  let post;
  let path;
  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    // if (!(await postRef.get()).exists) {
    //   return {
    //     notFound: true,
    //   };
    // }
    post = postToJSON(await postRef.get());
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>Sign Up to heart</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
