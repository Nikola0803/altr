import { Suspense } from "react";
import { Metadata } from "next";
import { LabResultsClient } from "./LabResultsClient";

export const metadata: Metadata = {
  title: "Lab Results | ALTR",
  description: "Independent batch verification reports for every ALTR product.",
};

export default function LabResultsPage() {
  return (
    <Suspense fallback={null}>
      <LabResultsClient />
    </Suspense>
  );
}
