# Taha Dates & Nuts — QR Menu Website

A mobile-friendly QR menu for **Taha Dates & Nuts** dry fruits shop. Customers scan a QR code to browse categories and prices. Shop owners manage prices from a separate admin panel.

## Features

- **Customer Menu** — Browse 15 categories with item names and prices (optimized for phone screens)
- **Admin Panel** — Search, filter, and update any item price instantly
- **Data Import** — All items imported from `Items.xlsx`

## Quick Start

```bash
# Install dependencies
npm install

# Import items from Items.xlsx into the database
npm run import

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer menu.

Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

**Default admin password:** `taha2024`

## Change Admin Password

Create a `.env.local` file:

```
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=your-random-secret-key
```

## QR Code

Generate a QR code pointing to your deployed website URL and print it for the shop.

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- SQLite (better-sqlite3)
- Data imported from Items.xlsx
