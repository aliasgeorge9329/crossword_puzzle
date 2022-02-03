import CrosswordPuzzle from "@/components/crossword/CrosswordPuzzle";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Index() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/");
  }, [user, loading]);

  return (
    <div>
      <CrosswordPuzzle />
    </div>
  );
}
