import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitNid } from "../services/api.js";

function NidVerificationPage() {
  const navigate = useNavigate();
  const [nidNumber, setNidNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      const result = await submitNid(nidNumber, dateOfBirth);
      if (!result.verified)
        throw new Error(result.reason || "NID details did not match.");
      setStatus(
        "Your NID has been verified. You can now use marketplace actions.",
      );
    } catch (requestError) {
      setError(requestError.message || "NID verification failed.");
    }
  }
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
        Identity verification
      </span>
      <h1 className="mt-3 text-3xl font-bold text-[#011F50]">
        Verify your NID
      </h1>
      <p className="mt-3 leading-7 text-slate-600">
        Use the details on your identity document. Your name is matched against
        your account.
      </p>
      <form
        className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          NID number
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0066FF]"
            value={nidNumber}
            onChange={(event) => setNidNumber(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Date of birth
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0066FF]"
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            required
          />
        </label>
        <button
          className="rounded-xl bg-[#0066FF] py-3 text-sm font-bold text-white hover:bg-[#011F50]"
          type="submit"
        >
          Submit for verification
        </button>
        {status && <p className="text-sm text-emerald-700">{status}</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>
      <button
        className="mt-5 text-sm font-bold text-[#0066FF]"
        type="button"
        onClick={() => navigate("/dashboard")}
      >
        Back to dashboard
      </button>
    </div>
  );
}

export default NidVerificationPage;
