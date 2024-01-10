import Link from "next/link";

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <Link href="/1">Egzamin 1</Link> <span>(może źle działać)</span>
        </li>
        <li>
          <Link href="/2">Egzamin 2</Link> <span>(może źle działać)</span>
        </li>
        <li>
          <Link href="/3">Egzamin 3</Link> <span>(może źle działać)</span>
        </li>
        <li>
          <Link href="/4">Egzamin 4</Link>
        </li>
        <li>
          <Link href="/5">Egzamin 5</Link>
        </li>
      </ul>
    </>
  );
}
