import Link from "next/link";

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <Link href="/1">Egzamin 1</Link>
        </li>
        <li>
          <Link href="/2">Egzamin 2</Link>
        </li>
      </ul>
    </>
  );
}
