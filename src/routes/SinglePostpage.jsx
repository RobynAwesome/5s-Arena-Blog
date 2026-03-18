import { useParams } from "react-router-dom";

export default function SinglePostPage() {
  const { slug } = useParams();
  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>You typed: {slug}</p>
    </div>
  );
}