# NIET CampusSpace — Intelligent Campus Resource Optimization System

A web application for facility booking, 8-period timetable scheduling (9:10 AM – 5:00 PM), multi-user mutual exclusion, and shortest walking route optimization using the **Floyd-Warshall Algorithm ($O(V^3)$)**.

Built with **HTML, Tailwind CSS, and Vanilla JavaScript (DOM)**.

---

## 🚀 How to Open & Deploy on GitHub Pages

If your repository is not opening or showing a blank page on GitHub, follow either of these two 30-second setups in your GitHub repository:

### Method 1: Using GitHub Actions (Recommended & Automatic)

This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Go to your repository on **GitHub.com**.
2. Click **Settings** (tab at the top right of the repository).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** > **Source**, choose **GitHub Actions** from the dropdown.
5. That's it! GitHub Actions will automatically build and publish your site at `https://<username>.github.io/<repo-name>/`.

---

### Method 2: Deploy from the `/docs` Folder (Instant Static Hosting)

The project includes a ready-to-serve pre-built static bundle in the `/docs` folder:

1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Under **Branch**, select `main` (or `master`) and select the **/docs** folder.
4. Click **Save**.
5. Your live link will appear at the top of the Pages screen within 1–2 minutes!

---

## 💻 Running Locally

To run the application on your local machine:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

To create an updated production build:
```bash
npm run build
```

---

## ✨ Core System Features

1. **8 Academic Periods (9:10 AM – 5:00 PM)**:
   - 4 Pre-lunch periods (50 min each): `09:10-10:00`, `10:00-10:50`, `10:50-11:40`, `11:40-12:30`
   - Campus Lunch Break: `12:30-01:30 PM` (1 hour)
   - 4 Post-lunch periods: `01:30-02:30 PM` (1 hour long Period 5), `02:30-03:20 PM`, `03:20-04:10 PM`, `04:10-05:00 PM`
2. **Flexible Time Spans**: Single-period lectures, 2-period lab practicums, half-day sessions, or custom start/end period spans.
3. **Dedicated Block & Classroom Selectors**: Choose target block (Block D, B, A, E) and specific classroom with dynamic cascading dropdowns.
4. **Mutual Exclusion Conflict Prevention**: Mathematical interval overlap detection ($S_1 < E_2 \land S_2 < E_1$) prevents conflicting bookings between users.
5. **Floyd-Warshall Shortest Path Routing ($O(V^3)$)**: Replaces Warshall reachability with quantitative distance and multi-hop route reconstruction. All distances scaled by 20.
6. **Strictly Locked Facilities**: Boy's Hostel, Girl's Hostel, and Block C remain permanently locked from academic reservations.
