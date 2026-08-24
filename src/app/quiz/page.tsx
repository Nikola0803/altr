import { Metadata } from "next";
import { QuizClient } from "./QuizClient";

export const metadata: Metadata = {
  title: "Find Your Protocol | ALTR",
  description: "A couple of quick questions, then a short list of research-first starting points chosen from what you tell us.",
};

export default function QuizPage() {
  return <QuizClient />;
}
