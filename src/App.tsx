import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
      <Toaster />
    </Suspense>
  );
}

export default App;
