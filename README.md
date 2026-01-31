# 🛒 Novalo - E-commerce

A high-performance, smooth-scrolling E-commerce application built with **Next.js 16** and **React 19**. This project focuses on a premium user experience with cinematic scroll effects, robust state management, and seamless authentication.

---

## ✨ Key Features

* **⚡ High-Performance Rendering:** Leverages Next.js App Router for optimized loading and SEO.
* **🌊 Fluid Smooth Scroll:** Integrated with **Lenis** for a high-end, native-feeling scroll experience.
* **🔐 Advanced Auth System:** Secure registration and login flow using **JWT decoding**, **Cookies**, and **Middleware** protection.
* **🛒 Smooth Navigation:** Fully SPA-compliant routing with `next/navigation` for zero-refresh transitions.
* **🛡️ Robust Form Handling:** Client-side validation powered by **Formik** and **Yup**.
* **🛰️ Real-time Data Fetching:** Optimized API synchronization using **TanStack React Query** (SWR pattern).
* **🎨 Premium UI Kit:** Built with **Tailwind CSS**, **Radix UI** primitives, and **Flowbite** components.

---

## 🛠️ Tech Stack

### Frontend Core
- **Framework:** Next.js 16 (Client Components & Server Actions)
- **State Management:** TanStack Query & React Context API
- **Styling:** Tailwind CSS (with `tailwind-merge` and `clsx` for dynamic classes)
- **Animations:** Lenis (Smooth Scroll), Embla Carousel, Flickity

### Logic & Security
- **Authentication:** `js-cookie` for persistence & `jwt-decode` for user session parsing.
- **Form Management:** Formik & Yup (Validation).
- **HTTP Client:** Axios with custom interceptors.

---

## 🧭 Project Navigation

| Route | Description | Feature Highlights |
| :--- | :--- | :--- |
| `/` | **Home** | Embla Carousel, Featured Products, Smooth Scroll |
| `/login` | **Authentication** | JWT Auth, Cookie-based session persistence |
| `/register` | **Onboarding** | Formik Validation, #12bb9c Branded Success UI |
| `/products` | **Catalog** | Radix UI Filters, Selectors, and Sliders |
| `/cart` | **Checkout** | Real-time updates, Skeleton loading states |

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/bibo1999/Novalo-commerce]

```

2. **Install dependencies:**
```bash
npm install

```



3. **Run the development server:**
```bash
npm run dev

```



---

## 🎨 UI Reference

* **Primary Brand Color:** `#12bb9c`
* **Secondary Color:** `#001f3f` (Deep Navy)
* **Feedback:** `react-hot-toast` for notifications and `react-loading-skeleton` for data transitions.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

```
