// מצב קריאה לדף המחשה בודד — A4 אמיתי, ניווט נקי ומרכז הדפסה עברי.
// ?print=1 נשמר לתאימות; ?bw=1 שומר מצב שחור־לבן; ?preview=1 מיועד אך ורק
// לתצוגה המקדימה של מרכז ההדפסה ומציג את עמוד ה-A4 הראשון ללא סרגלים.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AidReaderBar } from "@/components/hamchashot/AidReaderBar";
import { AidDoc, AidDocPages, AID_DOCS, aidDocPageCount } from "@/components/hamchashot/registry";
import { AID_TOPICS, aidItemsOfTopic } from "@/lib/aidTopics";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "אביזר נלווה להמחשה — הוראת זוויות",
  robots: { index: false },
};

export default async function AidReadPage({
  params,
  searchParams,
}: {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ print?: string; bw?: string; preview?: string }>;
}) {
  const { n: nRaw } = await params;
  const sp = await searchParams;
  const n = Number(nRaw);
  if (!Number.isInteger(n) || n < 1 || n > AID_DOCS.length) notFound();

  const doc = AID_DOCS[n - 1];
  const topic = AID_TOPICS.find((t) => t.id === doc.topic)!;
  const inTopic = aidItemsOfTopic(doc.topic);
  const idx = inTopic.findIndex((it) => it.n === n);
  const bw = sp.bw === "1";
  const preview = sp.preview === "1";

  return (
    <div className={`ws-page${preview ? ` ${styles.preview}` : ""}`}>
      {!preview && (
        <AidReaderBar
          n={n}
          title={doc.label}
          topicTitle={topic.title}
          topicHref={`/hamchashot/t/${topic.id}`}
          prevN={idx > 0 ? inTopic[idx - 1].n : null}
          nextN={idx < inTopic.length - 1 ? inTopic[idx + 1].n : null}
          bw={bw}
          pageCount={aidDocPageCount(n)}
          autoPrint={sp.print === "1"}
        />
      )}
      <div className={`ws-page__sheets${bw ? " ws-bw" : ""}`}>
        {preview ? <AidDoc n={n} /> : <AidDocPages n={n} />}
      </div>
    </div>
  );
}
