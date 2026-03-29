import { signInWithGoogle  } from "../../firebase";

const Login = () => {
    return (
        <div className="dashboard">
            <button onClick={signInWithGoogle}>
                Sign in to Google.
            </button>

        </div>
    )
}

export default Login