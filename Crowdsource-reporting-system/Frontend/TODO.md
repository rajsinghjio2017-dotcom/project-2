# Frontend Enhancement TODO

## Corrections and Fixes
- [x] Fix App.js: Remove duplicate routes for /login and /register, fix invalid JSX like <Login page/>
- [x] Update Footer.jsx: Change title from "MyProject" to "Crowdsource Reporting System" for consistency
- [ ] Fix AdminDashboard.jsx: Update useEffect dependency array to [view]
- [ ] Update UserDashboard.jsx: Replace hardcoded data with API fetch, add loading/error states

## Enhancements
- [x] Install Framer Motion: Run `npm install framer-motion`
- [x] Update tailwind.config.js: Extend with custom animations and colors
- [x] Update index.css: Add global animation classes (fade-in, slide-up)
- [x] Enhance Navbar.jsx: Add hover animations, improve mobile menu with slide-in effect
- [x] Update Home.jsx: Rename component to Home, add fade-in animations, improve layout with cards, add call-to-action buttons
- [x] Enhance Login.jsx: Add form animations (input focus effects), improve backdrop blur, add loading spinners
- [ ] Enhance Register.jsx: Add form animations (input focus effects), improve backdrop blur, add loading spinners
- [ ] Enhance ReportForm.jsx: Add validation feedback, image upload preview, better category selection with icons
- [ ] Enhance AdminDashboard.jsx: Add animations to sidebar, improve tables with pagination, add confirmation modals for updates
- [ ] Update ProtectedRoute.jsx: Add role-based protection if needed

## Testing and Verification
- [ ] Test the app: Run `npm start`, check routing, forms, dashboards
- [ ] Verify animations and responsiveness on different devices
- [ ] Ensure API integrations work (backend must be running)
