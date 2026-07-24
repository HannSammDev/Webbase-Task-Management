import { LoginForm } from "../../features/auth/LoginForm";


export const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-white text-slate-900  dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-full flex-col md:flex-row">
        <div className="relative  flex-1 overflow-hidden bg-linear-to-br from-sky-600 via-blue-700 to-indigo-800 px-8 py-16 text-white md:flex md:flex-col md:justify-center">
          <div className="relative z-10 max-w-xl space-y-6 backdrop-blur-sm">
            <div className="inline-flex w-80 items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/90 shadow-lg shadow-black/10">
              <img
                src="./logo2.png"
                alt="Task Manager logo"
                className="h-12 w-12 rounded-full border border-white/20 bg-white/10 p-2"
              />
              <span>Task Manager</span>
            </div>
            <div className="space-y-4 ">
              <h1 className="text-5xl font-extrabold leading-tight sm:text-5xl">
                Organize your work with a beautiful task dashboard.
              </h1>
              <p className="max-w-lg text-base text-slate-100/90 sm:text-lg">
                Keep every task in view, plan deadlines, and stay focused with
                an intuitive workflow designed for modern teams.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-100/85">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                Smart task boards and fast updates.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                Prioritize your most important work with clarity.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                Designed for desktop and mobile productivity.
              </li>
            </ul>
          </div>
          {/* <div className="flex justify-end "> 
            <a href="" className="text-sm ">
              Login
            </a>
          </div> */}
        </div>

        <main className="flex flex-1 items-center justify-center px-4 py-3 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl rounded-4xl bg-white dark:bg-white p-6 shadow-2xl shadow-slate-900/5 ring-1 ring-slate-200  dark:ring-white/10 sm:p-10">
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
};
