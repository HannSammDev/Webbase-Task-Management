import React from "react";
import { db } from "../Config/firebase";
import { collection, addDoc } from "firebase/firestore";
export const Test = () => { 
    const [name, setName] = React.useState("");
    const testAddData = async () => {
        try {
            const docRef = await addDoc(collection(db, "testCollection"), {
                // data to be added
                name:name,
                // value:value.Math.random() * 100
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setName("");
    };
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Test Page</h1>
            <p className="mt-2 text-gray-700 dark:text-gray-200">This is a test page for development purposes.</p>
            <form action="" onSubmit={(e) => {
                e.preventDefault();
                testAddData();
            }}>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter something..." className="border p-2 rounded-lg w-full mb-4" />
                
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Submit</button>
            </form>
        </div>
    )
}