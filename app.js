const $ = (selector) => document.querySelector(selector);

const defaultProfile = {
  name: "Mr Leshan",
  realName: "Biegon Emmanuel",
  tagline: "Computer Science Professional | Computer Teacher | Web Developer",
  bio: "I am a Computer Science Professional, Computer Teacher and Web Developer based in Kenya. I specialize in software development, networking, database management, website development and computer systems. I enjoy teaching, building modern applications and solving real-world problems through technology.",
  tags: [
    "Computer Science",
    "Computer Teaching",
    "Web Development",
    "Software Development",
    "Networking",
    "Database Management",
    "ICT Education"
  ],
  education: [
    ["Bachelor of Science in Computer Science", "University of Kabianga"],
    ["Diploma in Computer Science", "Belgut Technical Training Institute"]
  ],
  interests: [
    "Software Development", "Web Development", "Networking",
    "Cyber Security", "Database Management", "Artificial Intelligence", "ICT Education"
  ],
  skills: [
    "HTML5", "CSS3", "JavaScript", "Python", "Java",
    "C Programming", "PHP", "SQL", "Networking",
    "Cyber Security", "Database Management", "Microsoft Office"
  ],
  projects: [
    ["School Management System", "A computerized system for managing school records efficiently."],
    ["Library Management System", "A database-driven application for managing library operations."],
    ["Student Result Management System", "An online platform for recording and generating examination results."],
    ["Personal Portfolio Website", "A professional website showcasing education, skills and projects."]
  ],
  contact: {
    profession: "Computer Science Professional",
    occupation: "Computer Teacher & Web Developer",
    institution: "University of Kabianga / Belgut Technical Training Institute",
    country: "Kenya",
    phone: "0711931912",
    email: "biegonemmanuel159@gmail.com",
    availability: "Monday - Saturday (8:00 AM - 6:00 PM)"
  },
  source: "https://biegonemmanuel159-star.github.io/biegon-emmanuel/"
};

let profile = JSON.parse(localStorage.getItem("mrLeshanProfile") || "null") || defaultProfile;
const bundledNotes = [
  {
    name: "Grade 10 ICT Notes — Term 1, 2 & 3",
    category: "ict",
    size: "PDF",
    dataUrl: "notes/GRADE-10-ICT-NOTES-TERM-1-2-3-TEACHER.CO_.KE_.pdf"
  },
  {
    name: "Grade 10 Computer Science Notes — Term 1, 2 & 3",
    category: "computer",
    size: "PDF",
    dataUrl: "notes/GRADE-10-COMPUTER-SCIENCE-NOTES-TERM-1-2-3-TEACHER.CO_.KE_.pdf"
  }
];

const savedUploadedNotes = JSON.parse(localStorage.getItem("mrLeshanUploadedNotes") || "[]");
let notes = [...bundledNotes, ...savedUploadedNotes];
let importedData = null;

function saveProfile() {
  localStorage.setItem("mrLeshanProfile", JSON.stringify(profile));
}

function renderProfile() {
  $("#profileName").textContent = profile.name;
  $("#profileRealName").textContent = profile.realName || "Biegon Emmanuel";
  $("#profileTagline").textContent = profile.tagline;
  $("#profileBio").textContent = profile.bio;
  $("#sourceLabel").textContent = profile.source ? new URL(profile.source).hostname : "Not imported yet";

  $("#profileTags").innerHTML = (profile.tags || [])
    .map(tag => `<span>${escapeHtml(tag)}</span>`).join("");

  $("#educationList").innerHTML = (profile.education || [])
    .map(item => `<div><strong>${escapeHtml(item[0])}</strong><span>${escapeHtml(item[1])}</span></div>`).join("");

  $("#interestsGrid").innerHTML = (profile.interests || [])
    .map(item => `<span>${escapeHtml(item)}</span>`).join("");

  $("#skillsGrid").innerHTML = (profile.skills || [])
    .map(item => `<span>${escapeHtml(item)}</span>`).join("");

  $("#projectsGrid").innerHTML = (profile.projects || [])
    .map(item => `<article class="project-card"><div class="project-number">${String(profile.projects.indexOf(item)+1).padStart(2,"0")}</div><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[1])}</p></article>`).join("");

  $("#contactGrid").innerHTML = Object.entries(profile.contact || {})
    .map(([key, value]) => `<div><span>${escapeHtml(labelize(key))}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
}

function renderNotes() {
  const query = $("#notesSearch").value.toLowerCase().trim();
  const category = $("#categoryFilter").value;

  const filtered = notes.filter(note => {
    const matchesText = note.name.toLowerCase().includes(query) || note.category.toLowerCase().includes(query);
    const matchesCategory = category === "all" || note.category === category;
    return matchesText && matchesCategory;
  });

  $("#noteCount").textContent = notes.length;

  $("#notesGrid").innerHTML = filtered.map(note => `
    <article class="note-card">
      <div class="note-icon">${iconFor(note.name)}</div>
      <h3>${escapeHtml(note.name)}</h3>
      <div class="note-meta">${escapeHtml(note.category)} • ${escapeHtml(note.size)}</div>
      <div class="note-actions">
        <a href="${note.dataUrl}" target="_blank" rel="noopener">Open Notes</a>
        ${note.localUpload ? '<button class="delete-note" data-name="' + escapeHtml(note.name) + '">Remove</button>' : ''}
      </div>
    </article>
  `).join("");

  $("#emptyNotes").classList.toggle("hidden", filtered.length > 0);
}

function iconFor(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf") || lower.includes("notes")) return "📕";
  if (lower.includes("network")) return "🌐";
  if (lower.includes("program")) return "💻";
  if (lower.includes("office")) return "📊";
  return "📘";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function labelize(value) {
  return value.replace(/[A-Z]/g, m => " " + m).replace(/^./, m => m.toUpperCase());
}

$("#photoInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    $("#profilePhoto").src = reader.result;
    localStorage.setItem("mrLeshanPhoto", reader.result);
  };
  reader.readAsDataURL(file);
});

const storedPhoto = localStorage.getItem("mrLeshanPhoto");
$("#profilePhoto").src = storedPhoto || "profile.jpeg.png";

$("#notesInput").addEventListener("change", async event => {
  for (const file of [...event.target.files]) {
    const dataUrl = await fileToDataUrl(file);
    notes.push({
      name: file.name,
      size: formatBytes(file.size),
      category: detectCategory(file.name),
      dataUrl,
      localUpload: true
    });
  }
  localStorage.setItem("mrLeshanUploadedNotes", JSON.stringify(notes.filter(n => n.localUpload)));
  renderNotes();
  event.target.value = "";
});

$("#notesGrid").addEventListener("click", event => {
  if (!event.target.matches(".delete-note")) return;
  const name = event.target.dataset.name;
  notes = notes.filter(note => note.name !== name || !note.localUpload);
  localStorage.setItem("mrLeshanUploadedNotes", JSON.stringify(notes.filter(n => n.localUpload)));
  renderNotes();
});

$("#notesSearch").addEventListener("input", renderNotes);
$("#categoryFilter").addEventListener("change", renderNotes);

$("#themeBtn").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("mrLeshanTheme", next);
});

const savedTheme = localStorage.getItem("mrLeshanTheme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

$("#editProfileBtn").addEventListener("click", () => {
  $("#editName").value = profile.name;
  $("#editTagline").value = profile.tagline;
  $("#editBio").value = profile.bio;
  $("#editTags").value = profile.tags.join(", ");
  $("#profileDialog").showModal();
});

$("#profileForm").addEventListener("submit", event => {
  event.preventDefault();
  profile = {
    ...profile,
    name: $("#editName").value.trim() || "Mr Leshan",
    tagline: $("#editTagline").value.trim(),
    bio: $("#editBio").value.trim(),
    tags: $("#editTags").value.split(",").map(x => x.trim()).filter(Boolean)
  };
  saveProfile();
  renderProfile();
  $("#profileDialog").close();
});

$("#importBtn").addEventListener("click", async () => {
  const url = $("#sourceUrl").value.trim();
  if (!url) {
    $("#importStatus").textContent = "Enter your existing website URL first.";
    return;
  }

  $("#importBtn").disabled = true;
  $("#importStatus").textContent = "Importing website information…";

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: { "Accept": "text/html,application/xhtml+xml" }
    });
    if (!response.ok) throw new Error(`The website returned HTTP ${response.status}.`);

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const title = doc.querySelector("title")?.textContent?.trim() || doc.querySelector("h1")?.textContent?.trim() || "Imported website";
    const description = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "No meta description was found.";
    const headings = [...doc.querySelectorAll("h1,h2,h3,h4")].map(el => el.textContent.trim()).filter(Boolean).slice(0, 20);
    const paragraphs = [...doc.querySelectorAll("p")].map(el => el.textContent.replace(/\s+/g, " ").trim()).filter(text => text.length > 20).slice(0, 20);

    importedData = { source: url, title, description, headings, paragraphs };
    $("#importStatus").textContent = "Information imported. Review it below before adding it to the profile.";
    $("#importPreview").classList.remove("hidden");
    $("#importTitle").textContent = data.title || "Imported website";
    $("#importDescription").textContent = data.description || "No meta description was found.";
    $("#importHeadings").innerHTML = data.headings.map(h => `<span>${escapeHtml(h)}</span>`).join("");
    $("#importParagraphs").innerHTML = data.paragraphs.slice(0, 8).map(p => `<p>${escapeHtml(p)}</p>`).join("");
  } catch (error) {
    $("#importStatus").textContent = `Browser import was blocked or unavailable. The link is still saved below. Try a site that allows browser access, or use the profile editor to add the information manually. (${error.message})`;
  } finally {
    $("#importBtn").disabled = false;
  }
});

const savedSourceLinks = JSON.parse(localStorage.getItem("mrLeshanSourceLinks") || "[]");
const sourceLinkInput = $("#sourceUrl");
const sourceLinksBox = $("#sourceLinks");

function renderSourceLinks() {
  if (!sourceLinksBox) return;
  sourceLinksBox.innerHTML = savedSourceLinks.length
    ? savedSourceLinks.map((link, index) => `<div class="source-link"><a href="${escapeHtml(link)}" target="_blank" rel="noopener">${escapeHtml(link)}</a><button type="button" data-source-index="${index}" class="remove-source">Remove</button></div>`).join("")
    : '<p class="muted">No additional website links saved yet.</p>';
}

$("#saveSourceBtn")?.addEventListener("click", () => {
  const url = sourceLinkInput.value.trim();
  if (!/^https?:\/\//i.test(url)) {
    $("#importStatus").textContent = "Enter a complete website link beginning with http:// or https://.";
    return;
  }
  if (!savedSourceLinks.includes(url)) savedSourceLinks.push(url);
  localStorage.setItem("mrLeshanSourceLinks", JSON.stringify(savedSourceLinks));
  renderSourceLinks();
  $("#importStatus").textContent = "Website link saved. You can open it later or try importing it above.";
});

sourceLinksBox?.addEventListener("click", event => {
  const index = event.target.dataset.sourceIndex;
  if (index === undefined) return;
  savedSourceLinks.splice(Number(index), 1);
  localStorage.setItem("mrLeshanSourceLinks", JSON.stringify(savedSourceLinks));
  renderSourceLinks();
});

renderSourceLinks();

$("#applyImportBtn").addEventListener("click", () => {
  if (!importedData) return;

  const importedText = importedData.paragraphs.slice(0, 3).join(" ");
  const headings = importedData.headings.slice(0, 8);

  profile = {
    ...profile,
    tagline: importedData.description || profile.tagline,
    bio: importedText || profile.bio,
    tags: [...new Set([...profile.tags, ...headings])].slice(0, 12),
    source: importedData.source
  };

  saveProfile();
  renderProfile();
  $("#importStatus").textContent = "Imported information has been added to the profile.";
});

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

function detectCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes("network")) return "networking";
  if (lower.includes("program") || lower.includes("coding") || lower.includes("javascript")) return "programming";
  if (lower.includes("office") || lower.includes("word") || lower.includes("excel")) return "office";
  if (lower.includes("ict")) return "ict";
  if (lower.includes("computer")) return "computer";
  return "other";
}

renderProfile();
renderNotes();
$("#year").textContent = new Date().getFullYear();
