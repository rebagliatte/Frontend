import * as React from 'react';
import { SocialLogins } from 'gatsby-theme-firebase';
import { useToast } from '@chakra-ui/core';

// import { jsx } from "theme-ui";
// import * as React from "react";
// import useSiteMetadata from "../hooks/useSiteMetadata";
// import FormState from "../containers/FormState";
// import Header from "./Header";
// import LoginForm from "./LoginForm";
// import SignUpForm from "./SignUpForm";
// import PasswordResetForm from "./PasswordResetForm";
// import Nav from "./Nav";
// import ErrorMessage from "./ErrorMessage";

// const Form: React.FunctionComponent<{
//   onSignUpSuccess?: (user?: firebase.User | null) => void;
//   onLoginSuccess?: (user?: firebase.auth.UserCredential) => void;
//   onResetSuccess?: () => void;
// }> = ({ onLoginSuccess, onSignUpSuccess, onResetSuccess }) => {
//   const siteMetadata = useSiteMetadata();
//   const { formType, errorMessage } = FormState.useContainer();

//   return (
//     <div
//       sx={{
//         width: "100%",
//         maxWidth: "28rem",
//         margin: "0 auto",
//         boxShadow: "0 0 1.5rem 0 rgba(0,0,0,0.25)",
//       }}
//     >
//       <Header css={{ textAlign: "center" }}>
//         <h1 sx={{ my: 1 }}>{siteMetadata.title}</h1>
//       </Header>
//       <Nav />
//       {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
//       {formType === "login" && <LoginForm onSuccess={onLoginSuccess} />}
//       {formType === "signup" && <SignUpForm onSuccess={onSignUpSuccess} />}
//       {formType === "passwordReset" && (
//         <PasswordResetForm onSuccess={onResetSuccess} />
//       )}
//     </div>
//   );
// };

// export default Form;

interface LoginViewProps {
  onSignUpSuccess?: (user?: firebase.User | null) => void;
  onLoginSuccess?: (user?: firebase.auth.UserCredential) => void;
  onResetSuccess?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const toast = useToast();
  return (
    <>
      <SocialLogins
        onSuccess={onLoginSuccess}
        onError={(error) => {
          toast({
            title: 'Failed to log in',
            position: 'bottom-right',
            description: error.message,
            status: 'error',
            isClosable: true
          });
        }}
      />
    </>
  );
};

export default LoginView;
