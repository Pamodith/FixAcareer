import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import MainRoutes from "./routes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <MantineProvider>
      <Notifications />
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <div className="App">
            <MainRoutes />
          </div>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
