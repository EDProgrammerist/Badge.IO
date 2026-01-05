// app/lib/parser.ts

export interface Badge {
  name: string;
  url: string;
  markdown: string;
}

export interface Category {
  title: string;
  id: string;
  badges: Badge[];
}

export async function fetchAndParseBadges(): Promise<Category[]> {
  const SOURCE_URL = "https://raw.githubusercontent.com/alexandresanlim/Badges4-README.md-Profile/master/README.md";
  
  try {
    const response = await fetch(SOURCE_URL, { cache: 'no-store' });
    const text = await response.text();
    
    const categories: Category[] = [];
    const usedIds = new Set<string>(); // 🔍 TRACK USED IDS
    
    let currentCategory: Category | null = null;
    const lines = text.split('\n');

    // Regex for Markdown and HTML images
    const regex = /(?:!\[(.*?)\]\((.*?)\))|(?:<img.*?src=["'](.*?)["'].*?>)/;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // --- 1. DETECT HEADERS ---
      if (trimmedLine.startsWith('##')) {
        // Save previous category
        if (currentCategory && currentCategory.badges.length > 0) {
          categories.push(currentCategory);
        }

        const title = trimmedLine.replace(/^#+/, '').trim();
        
        // 🛡️ GENERATE UNIQUE ID
        let baseId = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        
        // If ID exists (e.g. 'how-to-use'), make it 'how-to-use-1', 'how-to-use-2'
        let uniqueId = baseId;
        let counter = 1;
        while (usedIds.has(uniqueId)) {
          uniqueId = `${baseId}-${counter}`;
          counter++;
        }
        usedIds.add(uniqueId);

        currentCategory = {
          title,
          id: uniqueId,
          badges: []
        };
      }

      // --- 2. DETECT BADGES ---
      if (currentCategory) {
        const match = trimmedLine.match(regex);
        if (match) {
          const url = match[2] || match[3];
          
          if (url && url.startsWith('http')) {
            // Filter noise
            if (url.includes('githubusercontent') && url.includes('screen')) continue;

            // Name Logic
            let name = match[1] || "Badge";
            if (name === "Badge" || name.length > 30) {
               const parts = url.split('/');
               name = parts[parts.length - 1].split('?')[0].replace(/[-_]/g, ' ');
            }
            name = name.charAt(0).toUpperCase() + name.slice(1);

            currentCategory.badges.push({
              name,
              url,
              markdown: `![${name}](${url})`
            });
          }
        }
      }
    }

    // Push final category
    if (currentCategory && currentCategory.badges.length > 0) {
      categories.push(currentCategory);
    }

    return categories;

  } catch (error) {
    console.error("Parser Error:", error);
    return [];
  }
}