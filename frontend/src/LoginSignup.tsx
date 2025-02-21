import GoogleButton from "react-google-button";

function LoginSignup() {
    const signIn = () => {
        window.open("http://localhost:3000/api/auth/google", "_self");
    };
    return (
        <>
            <GoogleButton onClick={signIn} />
        </>
    );
}

export default LoginSignup;
