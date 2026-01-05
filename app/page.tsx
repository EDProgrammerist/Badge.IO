import { fetchAndParseBadges } from "./lib/parser";
import BadgeGrid from "./components/BadgeGrid";

// Updated Metadata for the new name
export const metadata = {
  title: 'Badge.IO | Github README Assets',
  description: 'Browse and copy thousands of Github README badges instantly.',
};

export default async function Home() {
  const categories = await fetchAndParseBadges();
  
  // LOG: See if this prints in your SERVER terminal (not browser console)
  console.log(`PAGE.TSX: Sending ${categories.length} categories to Grid.`);

  return (
    <BadgeGrid data={categories} />
  );
}