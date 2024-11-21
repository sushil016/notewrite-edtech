// "use client";
// import { useAuth } from "@/hooks/useAuth";
// import Cookies from 'js-cookie';

// export function AuthDebug() {
//   const auth = useAuth();
//   const token = localStorage.getItem('token') || Cookies.get('token');

//   return process.env.NODE_ENV === 'development' ? (
//     <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs">
//       <pre>
//         {JSON.stringify(
//           {
//             isAuthenticated: auth.isAuthenticated,
//             isLoading: auth.isLoading,
//             user: auth.user ? {
//               ...auth.user,
//               id: '***'
//             } : null,
//             hasToken: !!token,
//             tokenPreview: token ? `${token.substring(0, 10)}...` : null,
//             cookieToken: !!Cookies.get('token'),
//             localStorageToken: !!localStorage.getItem('token')
//           },
//           null,
//           2
//         )}
//       </pre>
//     </div>
//   ) : null;
// } 