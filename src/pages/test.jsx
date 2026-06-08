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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Test Page
        </h1>
        <p className="mt-2 text-gray-700 dark:text-gray-200">
          This is a test page for development purposes.
        </p>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            testAddData();
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter something..."
            className="border p-2 rounded-lg w-full mb-4"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </form>

        {/* <main className="p-4 md:ml-64 h-auto pt-20" id="overview"> */}
          {/* <Outlet /> */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"></div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
          </div> */}
          {/* <Totals /> */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"> */}
          {/* <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div> */}
          {/* <RecentActivity /> */}
          {/* <Calendar /> */}
          {/* <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div> */}
          {/* <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div> */}
          {/* </div> */}
          {/* <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div> */}
          {/* <MyTask /> */}
          {/* <Kanban /> */}
          {/* <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
          </div> */}
        {/* </main> */}
      </div>
    );
}