import { RouterProvider } from "react-router-dom";
import { SpaceProvider } from "./contexts/SpacesContext";
import router from "./routes";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Lexend",
        },
      }}
    >
      <SpaceProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 2000,
              theme: {
                primary: "#4aed88",
              },
            },
            error: {
              duration: 2000,
              theme: {
                primary: "#ff4b4b",
              },
            },
          }}
        />
      </SpaceProvider>
    </ConfigProvider>
  );
};

export default App;
