// נקודת עריכה אחת לפרטי האתר והנכסים הציבוריים.
// תוכן וסדר החוברת נשארים ב-registry.ts בלבד.
export const SITE = {
  publicUrl: "https://zaviyot.vercel.app",
  applicationName: "זוויות",
  headerLead: "הדרכה במחוז ירושלים והעיר ירושלים - מנח״י, בהובלת איילת קריספין",
  academicYear: "שנה״ל התשפ״ז",
  managerCredit: "האתר מנוהל ע״י יניב רז · מדריך מחוזי חט״ב בעיר ירושלים",
  logo: {
    src: "/logo.png",
    alt: "יחידת מתמטיקה — מחוז ירושלים והעיר ירושלים",
  },
} as const;

export const PUBLIC_ASSETS = {
  worksheetsPdf: "/booklet-worksheets/zaviyot-worksheets.pdf",
  worksheetsPdfBw: "/booklet-worksheets/zaviyot-worksheets-bw.pdf",
  fullBookPdf: "/booklet/hoveret-zaviyot.pdf",
  fullBookPdfBw: "/booklet/hoveret-zaviyot-bw.pdf",
  video: "/video/zaviyot-race-lamillion.mp4",
  videoPoster: "/video/zaviyot-race-poster.jpg",
  presentationPdf: "/presentation/geometria-kdam-hesekit.pdf",
  worksheetDownloadName: "חוברת העבודה - זוויות.pdf",
  videoDownloadName: "זוויות - המירוץ למיליון.mp4",
  presentationDownloadName: "גאומטריה קדם-היסקית — מצגת.pdf",
  presentationTitle: "מצגת ההוראה — גאומטריה קדם-היסקית",
} as const;
