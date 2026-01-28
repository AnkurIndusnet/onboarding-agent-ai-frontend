
import { ChecklistProvider } from "./context/ChecklistContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ChecklistProvider>
      <AppRoutes />
    </ChecklistProvider>
  );
}

export default App;
