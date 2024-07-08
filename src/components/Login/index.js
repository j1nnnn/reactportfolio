import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithGoogle  } from "../../firebase";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ref } from 'firebase/storage';
import { useRef } from 'react';
import { auth } from '../../firebase';

// import { auth } from 'firebase/auth';

// const Login = () => {
//     return (
//         <div className="dashboard">
//             <button onClick={signInWithGoogle}>
//                 Sign in to Google.
//             </button>

//         </div>
//     )
// }



const Login = () => {

    const form = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            // navigate("/dashboard")
        } catch (error) {
            console.error(error)
            navigate("/")
        }
    }

    return (
        <div className="dashboard">
            <h1>Login to access Firebase data</h1>
            <form ref={form} onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSubmit}>Login</button>
            </form>
        </div>
    )
}

export default Login