import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function ToDoList() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section
        id="center"
        className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 flex flex-col gap-6">
          {/* Hero */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-indigo-50 rounded-full p-4">
              <img
                src="./SVGtodo.png"
                className="base"
                width="80"
                height="80"
                alt="Todo icon"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Get Started</h1>
            <p className="text-sm text-gray-400 italic">
              "Turn your 'to-do' into 'done'."
            </p>
          </div>

          {/* Counter */}
          <button
            type="button"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-xl transition-colors"
          >
           Sign Up
          </button>

          {/* Todo List */}
          <div className="ticks flex flex-col gap-2"></div>
        </div>
      </section>
      {/* <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section> */}
    </>
  );
}

export default ToDoList;
