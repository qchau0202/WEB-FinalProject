import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { LabelProvider } from "./contexts/LabelsContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const AppContent = () => {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      <AuthProvider>
        <LabelProvider>
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
        </LabelProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

// import { RouterProvider } from "react-router-dom";
// import router from "./routes";
// import { ConfigProvider } from "antd";
// import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "./contexts/AuthContext";
// import { LabelsProvider } from "./contexts/LabelsContext";
// import { NotesProvider } from "./contexts/NotesContext";

// const App = () => {
//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           fontFamily: "Lexend",
//         },
//       }}
//     >
//       <AuthProvider>
//         <LabelsProvider>
//           <NotesProvider>
//             <RouterProvider
//               router={router}
//               fallbackElement={
//                 <div className="flex items-center justify-center min-h-screen">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//               }
//             />
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 3000,
//                 style: {
//                   background: "#363636",
//                   color: "#fff",
//                 },
//                 success: {
//                   duration: 2000,
//                   theme: {
//                     primary: "#4aed88",
//                   },
//                 },
//                 error: {
//                   duration: 2000,
//                   theme: {
//                     primary: "#ff4b4b",
//                   },
//                 },
//               }}
//             />
//           </NotesProvider>
//         </LabelsProvider>
//       </AuthProvider>
//     </ConfigProvider>
//   );
// };

// export default App;
