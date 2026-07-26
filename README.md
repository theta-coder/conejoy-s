# Cone Joys 🍦

An interactive, scroll-driven web experience showcasing 12 signature ice cream flavours along a custom **3D Vertical Semi-Circular Arc**. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

---

## ✨ Features

- **3D Vertical Semi-Circular Arc Carousel**: As you scroll, ice cream cones smoothly travel along a C-shaped arc path using continuous trigonometric math (`sin` & `cos` parameters) with zero lag.
- **12 Signature Flavours**: Explore every scoop—from Mango and Kulfa to Black Currant and Kit Kat—with instant background color transitions matching each flavour.
- **Scroll-Driven Precision**: Powered by custom `requestAnimationFrame` loop that calculates continuous position, rotation, scale, blur, and opacity frame-by-frame.
- **Prominent Active Indicator**: Progress rail featuring a solid dark black highlighted indicator that tracks your exact position among all 12 flavours.
- **100% Responsive Layout**: Custom responsive breakpoints fine-tuned for desktop, tablet, and mobile screens without text or cone overlap.
- **WhatsApp Order Integration**: One-click direct order buttons linking directly to WhatsApp.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Fonts**: [Google Fonts (DM Sans & Manrope)](https://fonts.google.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/theta-coder/conejoy-s.git
cd conejoy-s
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
├── app/
│   ├── globals.css         # Tailwind CSS directives & utilities
│   ├── layout.tsx          # Root layout with Google Fonts & SEO metadata
│   └── page.tsx            # Home page entry
├── components/
│   └── ConeStory.tsx       # 3D Arc scroll renderer client component
├── data/
│   └── flavours.ts         # Signature flavour dataset & metadata
├── public/
│   └── assets/             # Cone images, brand logo, and favicon
├── .gitignore              # Git ignore rules
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 📄 License

Distributed under the MIT License.
