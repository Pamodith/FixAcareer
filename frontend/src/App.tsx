import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import MainRoutes from "./routes";

const App = () => {
  return (
    <MantineProvider>
      <Notifications />
      <ModalsProvider>
        <div className="App">
          <MainRoutes />
        </div>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
