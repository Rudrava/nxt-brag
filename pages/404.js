import Link from "next/link";

const custom404 = () => {
  return (
    <main>
      <h1>404 - that page did not exist...</h1>
      <iframe
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        frameborder="0"
        width="500"
        height="500"
        allowfullscreen
      ></iframe>
      <Link href="/">
        <button className="btn-blue">Go Home</button>
      </Link>
    </main>
  );
};

export default custom404;
