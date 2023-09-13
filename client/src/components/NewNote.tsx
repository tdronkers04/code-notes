import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function NewNote() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const { getToken } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const createNote = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:8000/new-note", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: "cors",
          },
          body: JSON.stringify({ code: value }),
        });

        if (!response.ok) {
          throw new Error("Something went wrong posting data to the server.");
        }

        setValue("");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === "string") {
          setError({ message: err } as Error);
        }
      }
    };
    createNote();
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-w-full">
      <form onSubmit={handleSubmit}>
        <label>
          <textarea
            placeholder="type some code here"
            className="bg-blue-100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
        </label>
        <input className="bg-green-200" type="submit" value="Submit" />
      </form>
    </div>
  );
}
