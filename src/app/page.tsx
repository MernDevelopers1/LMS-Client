export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[2fr_1fr]">
        <section className="flex min-h-[44vh] items-center justify-center bg-[linear-gradient(110deg,#ff442c_0%,#ff365f_58%,#fb326d_100%)] px-6 text-white lg:min-h-screen">
          <div className="w-full max-w-5xl text-center">
            <h1 className="text-4xl font-normal leading-tight sm:text-5xl lg:text-[52px]">
              Learning Management System
            </h1>
            <p className="mt-5 text-lg font-normal sm:text-2xl">
              Advancing Education Through Technology and Continuous Learning.
            </p>
          </div>
        </section>

        <section className="flex min-h-[56vh] flex-col items-center justify-center px-6 py-12 lg:min-h-screen">
          <form className="flex w-full max-w-[480px] flex-col items-center">
            <h2 className="text-center text-[42px] font-normal leading-tight">
              Login
            </h2>
            <p className="mt-4 max-w-[460px] text-center text-[22px] leading-8">
              Please enter your user name and password to login
            </p>

            <div className="mt-12 flex w-full flex-col gap-4">
              <label className="sr-only" htmlFor="username">
                User name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="h-[54px] w-full rounded-[6px] border border-slate-300 bg-white px-4 text-xl outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
              />

              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-12 w-full rounded-[4px] border border-slate-300 bg-white px-4 text-lg outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="mt-6 h-12 rounded-[5px] bg-blue-600 px-5 text-[21px] font-normal text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Login
            </button>

            <p className="mt-32 text-center text-[21px] leading-8 lg:mt-32">
              Don&apos;t have an account?{" "}
              <a className="text-blue-600 underline-offset-2 hover:underline" href="#">
                Contact Us Now
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
