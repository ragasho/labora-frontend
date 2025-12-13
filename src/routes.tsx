
import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { DailyFreshMeatPage } from "./components/DailyFreshMeatPage";
import { WowFoodPage } from "./components/WowFoodPage";
import { FairTripPage } from "./components/FairTripPage";
import { SubscriptionManagementPage } from "./components/SubscriptionManagementPage";
import { OrderHistory } from "./components/OrderHistory";
import { WalletPage } from "./components/WalletPage";
import { PaymentPage } from "./components/PaymentPage";
import { GroceryPage } from "./components/GroceryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GroceryPage /> },
      { path: "freshcarne", element: <DailyFreshMeatPage /> },
      { path: "wowfood", element: <WowFoodPage /> },
      { path: "fairtrip", element: <FairTripPage /> },
      { path: "subscriptions", element: <SubscriptionManagementPage /> },
      { path: "orders", element: <OrderHistory /> },
      { path: "wallet", element: <WalletPage /> },
      { path: "payment", element: <PaymentPage /> },
    ],
  },
]);
