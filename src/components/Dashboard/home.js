import { auth, storage, db } from '../../firebase';
import { useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
// import { collection } from 'firebase/firestore/lite';


const Home = () => {
    const form = useRef();
 
    const submitPortfolio = (e) => {
        e.preventDefault();
        const name = form.current[0]?.value;
        const dates = form.current[1]?.value;
        const description = form.current[2]?.value;
        const url = form.current[3]?.value;
        const image = form.current[4]?.files[0];

        console.log(name, dates, description, url, image);
        const storageRef = ref(storage, `portfolio/${image.name}`);

        uploadBytes(storageRef, image).then(
            (snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    savePortfolio({
                        name,
                        dates,
                        description,
                        url,
                        image: downloadUrl
                    })
                }, (error) => {
                    console.log(error);
                    savePortfolio({
                        name,
                        dates,
                        description,
                        url,
                        image: null
                    })
                })
            }, (error) => {
                console.log(error);
                savePortfolio({
                    name,
                    dates,
                    description,
                    url,
                    image: null
                })
            }
        )
    }

    const savePortfolio = async (portfolio) => {
        console.log(portfolio);
        try {
            await addDoc(collection(db, 'portfolio'), portfolio);
            window.location.reload(false);
        } catch (error) {
            console.log(error);
            alert('Failed to add porfolio');
            
        }
    }

    return (
        <div className='dashboard'>

            <form ref={form} onSubmit={submitPortfolio}>
                <p><input type="text" placeholder="Name" /></p>
                <p><input type="text" placeholder="Dates" /></p>
                <p><textarea placeholder="Description" /></p>
                <p><input type="text" placeholder="Url" /></p>
                <p><input type="file" placeholder="Image" /></p>
                <button type="submit">Submit</button>
                <button onClick={() => auth.signOut()}>Sign Out</button>
            </form>
        </div>
    )
}

export default Home