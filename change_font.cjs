const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = [...walk('./src'), './index.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (file.endsWith('index.html')) {
    if (content.includes('family=Inter')) {
      content = content.replace(/family=Inter:wght@[0-9;]+&?/, '');
      changed = true;
    }
    if (content.includes('family=Syne')) {
      content = content.replace(/family=Syne:wght@[0-9;]+&?/, '');
      changed = true;
    }
    // Add Space Grotesk
    if (!content.includes('family=Space+Grotesk')) {
      content = content.replace('family=JetBrains', 'family=Space+Grotesk:wght@300;400;500;600;700;800&family=JetBrains');
      changed = true;
    }
  }

  // Replace font families
  const original = content;
  content = content.replace(/'Inter'/g, "'Space Grotesk'");
  content = content.replace(/'Syne'/g, "'Space Grotesk'");

  if (content !== original) {
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
