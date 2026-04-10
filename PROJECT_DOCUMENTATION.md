# 📘 CodeLearn – Complete Project Documentation

---

## 1. Project Overview

**CodeLearn** is a theory-first, structured learning portal built for students who want to master programming concepts through well-organized tutorials. The platform provides:

- Categorized programming tutorials (e.g. HTML, CSS, JavaScript)
- Topics within each tutorial with Theory, Code Examples, and Resources tabs
- Downloadable PDF notes and curated video references per topic
- User authentication (Register / Login / Email Verification)
- A full Admin Panel for managing content
- A Contact form with message inbox in admin

**Project Name:** CodeLearn  
**Type:** Web Application (SPA – Single Page Application)  
**Firebase Project ID:** `codelearn-1a663`  
**Auth Domain:** `codelearn-1a663.firebaseapp.com`

---

## 2. Tech Stack & Libraries

| Technology | Version | Purpose |
|---|---|---|
| **React** | v19.2.0 | Frontend UI library |
| **Vite** | v7.2.4 | Build tool and dev server |
| **React Router DOM** | v7.11.0 | Client-side routing / navigation |
| **Firebase** | v12.7.0 | Backend-as-a-Service (Auth + Firestore) |
| **Tailwind CSS** | v4.1.18 | Utility-first CSS styling framework |
| **@tailwindcss/vite** | v4.2.1 | Tailwind integration plugin for Vite |
| **@vitejs/plugin-react** | v5.1.1 | React Fast Refresh plugin for Vite |
| **ESLint** | v9.39.1 | Code linting and quality enforcement |

### Firebase Services Used
- **Firebase Authentication** – Email/Password sign-in with email verification
- **Cloud Firestore** – NoSQL database for tutorials, sections, resources, users, messages

---

## 3. Project Folder Structure

```
codelearn/
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images, icons, etc.
│   ├── components/           # Reusable UI components
│   │   ├── AdminLayout.jsx   # Admin panel layout wrapper
│   │   ├── AdminNavbar.jsx   # Admin panel navigation bar
│   │   ├── CodeLearnLogo.jsx # Brand logo component
│   │   ├── Footer.jsx        # Public site footer
│   │   ├── Header.jsx        # Public site header/navbar
│   │   ├── ProtectedRoute.jsx# Route guard for auth
│   │   ├── SearchBar.jsx     # Tutorial search component
│   │   └── Sidebar.jsx       # Admin sidebar navigation
│   ├── firebase/
│   │   └── config.js         # Firebase initialization & exports
│   ├── pages/                # Full page components
│   │   ├── Home.jsx          # Landing page
│   │   ├── About.jsx         # About page
│   │   ├── Contact.jsx       # Contact form page
│   │   ├── Login.jsx         # Login page
│   │   ├── Registration.jsx  # Registration page
│   │   ├── Tutorials.jsx     # All tutorials listing
│   │   ├── Tutorial.jsx      # Single tutorial topics listing
│   │   ├── TopicDetails.jsx  # Topic content viewer (most complex)
│   │   ├── AdminDashboard.jsx# Admin home dashboard
│   │   ├── AdminTutorials.jsx# Manage tutorials CRUD
│   │   ├── AdminSections.jsx # Manage sections/topics CRUD
│   │   ├── AdminResources.jsx# Manage resources CRUD
│   │   └── AdminMessages.jsx # View contact messages
│   ├── App.jsx               # Root component + routing
│   ├── main.jsx              # React app entry point
│   └── index.css             # Global styles
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
└── package.json              # Project dependencies
```

---

## 4. Routing Architecture

All routes are defined in `App.jsx` using React Router v7.

| Route | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/about` | `About` | Public |
| `/contact` | `Contact` | Public |
| `/login` | `Login` | Public |
| `/register` | `Registration` | Public |
| `/tutorials` | `Tutorials` | Public |
| `/tutorial/:tutorialId` | `Tutorial` | 🔒 Protected (Login required) |
| `/tutorial/:tutorialId/:sectionId` | `TopicDetails` | 🔒 Protected (Login required) |
| `/admin` | `AdminDashboard` | 🔒 Admin Only |
| `/admin/tutorials` | `AdminTutorials` | 🔒 Admin Only |
| `/admin/sections` | `AdminSections` | 🔒 Admin Only |
| `/admin/resources` | `AdminResources` | 🔒 Admin Only |
| `/admin/messages` | `AdminMessages` | 🔒 Admin Only |

**Header/Footer Visibility Rules:**
- Hidden on: `/login`, `/register`, all `/admin/*` routes, all `/tutorial/*` routes
- Shown on: Home, About, Contact, Tutorials

---

## 5. Firebase Authentication

### Method Used
**Email/Password Authentication** with **Email Verification**

### Registration Flow
1. User fills in Email + Password + Confirm Password
2. `registerUser()` is called → creates Firebase Auth user
3. A verification email is sent automatically by Firebase
4. A document is written to Firestore `users` collection with uid, email, role, createdAt
5. User redirected to `/login` with a success message

### Login Flow
1. User enters Email + Password
2. `loginUser()` → Firebase Auth checks credentials
3. If `user.emailVerified === false` → user is logged out, error shown
4. If verified → Firestore `users` doc is read for `role`
5. If `role === "admin"` → redirect to `/admin`; else → redirect to `/tutorials` or original URL

### Admin Assignment
If the registered email is `ismailgheewala1@gmail.com`, `role: "admin"` is saved in Firestore. All others get `role: "user"`.

---

## 6. Firestore Database Structure

### Collection: `users`
```
users/{uid}
  uid: string
  email: string
  role: "user" | "admin"
  createdAt: Timestamp
```

### Collection: `tutorials`
```
tutorials/{tutorialId}
  title: string
  description: string
  isActive: boolean
  order: number
  └── sections/  (sub-collection)
```

### Sub-Collection: `tutorials/{tutorialId}/sections`
```
sections/{sectionId}
  title: string
  content: string        (theory text)
  example: string        (code example)
  exampleExplanation: string
  order: number
  resources: {
    pdfs: [{ title, url }]
    videos: [{ title, url }]
    visuals: [{ title, url }]
  }
```

### Collection: `contactMessages`
```
contactMessages/{messageId}
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "read"
  createdAt: Timestamp
```

---

## 7. Application Flow

```
Public → Home / About / Contact / Tutorials
                    ↓
     User clicks tutorial → ProtectedRoute
                    ↓
          Login Required → /login → /register
                    ↓
    /tutorial/:id → Topics List
                    ↓
    /tutorial/:id/:sectionId → TopicDetails
         Theory | Code Example | Resources tabs
         Prev / Next navigation

Admin Flow:
    Login (admin email) → role check in Firestore
                    ↓
    /admin Dashboard → Tutorials / Sections / Resources / Messages
```

---

---

# 🎤 VIVA QUESTIONS AND ANSWERS

---

## Section A: General Project

**Q1. What is CodeLearn?**
CodeLearn is a theory-first online learning portal where students study programming topics (HTML, CSS, JavaScript) through structured tutorials. Each topic includes written theory, code examples, and downloadable resources. Users must register and verify their email. An admin manages all content through a dedicated admin panel.

**Q2. What problem does it solve?**
Students lack structured, written programming content suited for exam preparation. Most platforms are video-heavy with no proper theory explanations. CodeLearn fills this gap with organized theory, code examples, and supplemental resources in one place.

**Q3. Who are the users?**
1. Students – register, verify email, log in, access tutorial content.
2. Admin – manages tutorials, sections, resources, and reads messages via the admin panel.

**Q4. What type of application is it?**
A Single Page Application (SPA). The entire app loads once; navigation happens client-side via React Router without full page reloads.

---

## Section B: Technology

**Q5. Why React?**
React's component-based architecture allows reusable UI pieces. Hooks (useState, useEffect) simplify state and data fetching. The rich ecosystem with React Router and Firebase SDK made it ideal.

**Q6. What is Vite? Why not Create React App?**
Vite is a modern build tool using native ES modules. It's far faster to start and hot-reload than CRA. It's the current industry-standard for new React projects.

**Q7. What is Tailwind CSS?**
A utility-first CSS framework. You apply pre-built classes directly in JSX (e.g., `text-lg font-bold`) instead of writing custom CSS files. Speeds up development and keeps styling consistent.

**Q8. How did you use React Router?**
- `<Routes>/<Route>` in App.jsx to map URLs to components
- `<Link>` for navigation without reload
- `useNavigate()` to redirect after login
- `useParams()` to get `:tutorialId` and `:sectionId` from URL
- `useLocation()` to save and restore the pre-login URL

---

## Section C: Firebase

**Q9. What is Firebase?**
Firebase is Google's Backend-as-a-Service (BaaS). It provides Authentication, Firestore (NoSQL database), storage, and hosting without a custom backend server.

**Q10. What is Firestore? How is it different from SQL?**
Firestore is a NoSQL, document-collection database. No tables or rows — data is in Documents (JSON-like) inside Collections. Schema-less, auto-scaling, supports real-time listeners. Unlike SQL, no JOIN operations; relationships are handled through sub-collections or document references.

**Q11. Explain your Firestore structure.**
- `users/{uid}` – user info and role
- `tutorials/{id}` – tutorial metadata with `isActive` and `order`
- `tutorials/{id}/sections/{id}` – topic content, code, and nested resources object
- `contactMessages/{id}` – contact form submissions with read status

**Q12. Which Firebase Auth method did you use?**
Email/Password Authentication with Email Verification. After registration, Firebase sends a verification email. Login is blocked if email is not verified (`user.emailVerified === false`).

**Q13. What is `serverTimestamp()`?**
A Firestore sentinel value that records the exact server time when the document is written, avoiding issues with client device timezone or clock differences.

**Q14. How do you read from Firestore?**
- `getDocs(query)` – fetches a list of documents (with `orderBy`, `where` filters)
- `getDoc(docRef)` – fetches a single specific document
- Results mapped: `docs.map(d => ({ id: d.id, ...d.data() }))`

**Q15. How do you write/update Firestore?**
- `addDoc()` – adds new document with auto ID
- `setDoc()` – sets specific document ID; with `{ merge: true }` it merges instead of overwriting
- `updateDoc()` – updates specific fields of existing document

**Q16. What is `orderBy`?**
A query modifier that sorts returned documents by a field. I use `orderBy("order", "asc")` to display tutorials and sections in the correct custom order.

**Q17. What is `where()`?**
A query filter. `where("isActive", "==", true)` only returns active tutorials. `where("status", "==", "new")` only returns unread messages.

---

## Section D: Authentication & Security

**Q18. How do you protect routes?**
`ProtectedRoute` component checks if `user` exists. If not, it `<Navigate>`s to `/login` preserving the current location in `state.from`. After login, the user is redirected back to the original URL.

**Q19. What is `onAuthStateChanged`?**
A Firebase listener that fires whenever auth state changes (login, logout, page refresh). Used in App.jsx to persistently track the logged-in user and pass it down as a prop to all routes and ProtectedRoute.

**Q20. How do you separate admin from regular users?**
At registration, a `role` field is stored in Firestore. At login, this role is read. Admins go to `/admin`; students go to `/tutorials`. The distinction is based on the email used during registration.

**Q21. Can a regular user access `/admin`?**
Not through normal app flow. They would have to manually type the URL. For production, Firestore Security Rules would block unauthorized database reads/writes. The role check at login prevents direct admin routing.

---

## Section E: React Concepts

**Q22. What hooks did you use?**
- `useState` – local component state (lists, inputs, loading flags, active tab)
- `useEffect` – side effects (Firestore fetches on mount or when deps change)
- `useParams` – dynamic URL values
- `useNavigate` – programmatic navigation
- `useLocation` – current URL and state
- `useSearchParams` – query string parameters in admin pages

**Q23. Why do React lists need `key` prop?**
React uses `key` to identify list items during re-renders. Without it, React cannot efficiently determine which items changed, added, or removed, leading to bugs or unnecessary re-renders. I use Firestore document IDs as keys.

**Q24. What is conditional rendering?**
Rendering different JSX based on state/props. I use:
- `{loading ? <Spinner /> : <List />}` – loading states
- `{!hideLayout && <Header />}` – hide nav on specific pages
- `{activeTab === "Theory" && <TheoryContent />}` – tab switching

**Q25. What is component-based architecture?**
The app is built from small, self-contained, reusable components. Example: `ProtectedRoute` is written once and reused for all protected routes. `ResourceGroup` renders once for PDFs, once for Videos, once for Visuals, all with different props.

---

## Section F: Features

**Q26. Describe the tutorial viewing experience step by step.**
1. User clicks tutorial on Home/Tutorials page
2. ProtectedRoute checks login → redirects to /login if not authenticated
3. After login → /tutorial/:id shows topic list grid
4. User clicks a topic → /tutorial/:id/:sectionId opens TopicDetails
5. Left sidebar shows all topics; current is highlighted
6. Tabs: Theory (written content), Code Example (syntax-highlighted), Resources (PDFs/Videos/Visuals)
7. "View Code Example" button in Theory tab jumps to code tab
8. Prev/Next buttons at bottom for section-by-section navigation

**Q27. How does the Admin Panel work?**
4 sections: Manage Tutorials (CRUD + active toggle), Manage Sections (CRUD with theory/code/explanation), Manage Resources (attach PDFs/videos/visuals with auto Drive link conversion), View Messages (read/mark contact form submissions).

**Q28. Explain the Google Drive link auto-conversion.**
When admin pastes a share link, the app uses regex to extract `FILE_ID` from the URL. For PDFs it generates a `?export=download` URL (forces download). For visuals it generates a `?id=` preview URL. Titles are also auto-formatted: extension stripped, dashes/underscores replaced with spaces, each word capitalized.

**Q29. How does search work?**
Client-side search in SearchBar. It fetches tutorial titles on mount, filters with `.filter()` and `.includes()` as user types, showing matching results in a dropdown. Clicking a result navigates to that tutorial.

**Q30. How does email verification work?**
Firebase automatically sends a verification link when `registerUser()` is called. On login, I check `user.emailVerified`. If false, I call `logoutUser()` immediately and display an error. This prevents access without email confirmation.

---

## Section G: Advanced Questions

**Q31. Difference between `setDoc` and `addDoc`?**
`addDoc` auto-generates a document ID. `setDoc` requires you to specify the document ID (or path) — useful when you want predictable IDs like the user's UID. With `{ merge: true }`, setDoc will patch existing data instead of overwriting everything.

**Q32. What is a sub-collection and why did you use it?**
A sub-collection is a collection nested inside a document. I store sections inside each tutorial document. This keeps data scoped, makes queries clean (`collection(db, "tutorials", id, "sections")`), and avoids Firestore's 1MB document size limit that would be hit if storing all sections as an array.

**Q33. Why not store sections as an array in the tutorial document?**
Firestore has a 1MB document size limit. With many sections each containing long theory text and code examples, this limit could be exceeded. Sub-collections have no such limit. Also, sub-collections can be queried individually with `orderBy` and `where`, which arrays cannot.

**Q34. Why is the Header hidden inside tutorials?**
The tutorial viewer has its own left sidebar for navigation. Keeping the top header would waste space and create a confusing double-navigation experience. `hideLayout` in App.jsx checks for `/tutorial/` in the path and hides both Header and Footer on those pages.

**Q35. What is `useEffect` cleanup? Did you use it?**
A cleanup function returned from `useEffect` runs when the component unmounts or before the effect re-runs. I use it in App.jsx for the `onAuthStateChanged` listener to call `unsubscribe()` on cleanup, preventing memory leaks from a dangling listener after the component is gone.

```js
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  });
  return () => unsubscribe(); // cleanup
}, []);
```

---

*Document prepared for CodeLearn Project Submission & Viva – April 2026*

