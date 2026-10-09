# FoodDelivery

FoodDelivery is a mobile food-ordering app built with Expo and React Native. It lets users browse nearby restaurants, search for food, favorite restaurants, add items to a cart, customize a burger, and track an order while it is being delivered.

## Overview

This project is a front-end prototype for a food delivery experience. The screens are designed to feel like a modern mobile app with a teal-and-white visual style, a bottom navigation bar, a restaurant listing screen, a cart checkout flow, and a live order-tracking screen.

The app does not use a backend service. Instead, it uses static mock data and shared React state to simulate the food ordering flow.

## How the app works

### 1. App entry and routing

The app starts from the Expo Router entry point configured in `package.json`:

- `main: "expo-router/entry"`

Routes are defined in the `src/app` folder. Every file in that folder is treated as a page or route by Expo Router. For example:

- `src/app/index.tsx` → home screen
- `src/app/discover.tsx` → restaurant discovery
- `src/app/restaurant.tsx` → restaurant menu
- `src/app/details.tsx` → item customization page
- `src/app/cart.tsx` → checkout/cart screen
- `src/app/tracking.tsx` → delivery status tracker
- `src/app/favorites.tsx` → saved favorites
- `src/app/profile.tsx` → profile/info screen

The root layout in `src/app/_layout.tsx` wraps the entire app in the global app provider and configures the stack navigator with hidden headers.

### 2. Shared app state

The app’s state is stored in `src/store/AppState.tsx`.

This file creates a React context called `AppProvider` and exposes shared functions such as:

- `addToCart(item)`
- `inc(key)`
- `dec(key)`
- `clearCart()`
- `toggleFav(id)`

It keeps track of:

- `cart`: items currently in the cart
- `subtotal`: cart total
- `count`: total quantity of items
- `favs`: a `Set` of favorite restaurant IDs

Because this state is global, all screens can update and read the same cart and favorites data without passing props manually through every screen.

### 3. Restaurant and menu data

The mock app data is defined in `src/data.ts`.

This file exports:

- `RESTAURANTS`: a list of restaurants with names, tags, ratings, delivery time, price, and image assets
- `MENU`: menu items for a selected restaurant
- `HOME_IMGS`: restaurant cover images for the home screen
- visual constants such as theme colors
- a small `money()` helper to format prices as currency

These values are used across the app to render restaurant cards, menu rows, cart totals, and order summaries.

### 4. Bottom navigation

The reusable tab navigation is located in `src/components/BottomNav.tsx`.

It renders a fixed bottom bar with tabs for:

- Home
- Search
- Orders
- Favorites
- Profile

The active tab is determined using the current Expo Router path.

### 5. Cart and checkout flow

The cart flow is handled in `src/app/cart.tsx`.

Users can:

- increase or decrease quantities
- see delivery fee and subtotal
- apply a promo code toggle (simulated)
- place the order and navigate to the tracking screen

The `Place Order` button pushes the user to `/tracking`.

### 6. Order tracking simulation

The tracking screen in `src/app/tracking.tsx` demonstrates the delivery status timeline.

It uses a simple `useState` step counter and a timer to advance through stages such as:

- Order confirmed
- Preparing
- Picked up
- On the way
- Delivered

This simulates a live delivery experience without a real backend.

### 7. Product inventory example (legacy / separate screen)

There is also a separate SQLite example screen at `src/screens/HomeScreen.js`.

This file is not part of the main Expo Router app flow. It demonstrates a simple inventory list with:

- search box
- SQLite database connection
- listing of products from `src/services/db.js`
- stock and price display

The database layer in `src/services/db.js` creates a `products` table and seeds sample records. This is a useful example of local database usage in Expo, but it is separate from the core food-delivery UI.

## Project structure

```text
FoodDelivery/
├── app.json
├── package.json
├── tsconfig.json
├── assets/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── cart.tsx
│   │   ├── details.tsx
│   │   ├── discover.tsx
│   │   ├── favorites.tsx
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   ├── restaurant.tsx
│   │   └── tracking.tsx
│   ├── components/
│   │   └── BottomNav.tsx
│   ├── data.ts
│   ├── screens/
│   │   └── HomeScreen.js
│   ├── services/
│   │   └── db.js
│   └── store/
│       └── AppState.tsx
└── README.md
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npm start
```

3. Run on a device or emulator:

```bash
npm run android
# or
npm run ios
# or
npm run web
```

## Tech stack

- Expo
- React Native
- Expo Router
- TypeScript
- Expo SQLite
- expo-font

## Notes

This app is a UI prototype and mock data experience rather than a production food-delivery backend. It helps visualize a modern ordering flow and is especially useful for learning Expo Router, shared state, and screen-based app design.
# ITMSD-1_Lab05_Lolo_LeandroAlexis
