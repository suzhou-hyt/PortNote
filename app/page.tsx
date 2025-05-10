export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">PortNote</h1>
      </div>

      <div className="w-full max-w-md">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-8">
          <legend className="fieldset-legend text-xl font-bold px-4">Login</legend>

          <div className="space-y-6">
            <div>
              <label className="label font-medium">
                <span className="label-text text-base">Email</span>
              </label>
              <input type="email" className="input input-bordered w-full" placeholder="Enter your email" />
            </div>

            <div>
              <label className="label font-medium">
                <span className="label-text text-base">Password</span>
              </label>
              <input type="password" className="input input-bordered w-full" placeholder="Enter your password" />
            </div>
            <button className="btn btn-neutral w-full">Login</button>
          </div>
        </fieldset>
      </div>
    </div>
  )
}
