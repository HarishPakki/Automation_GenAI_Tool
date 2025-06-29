import { useState } from "react";

export default function Input({ name = "", id, submit, cancel, newType }) {
  const [value, setValue] = useState(name);

  return (
    <>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
      />
      <span
        onClick={() => {
          submit(id, value, newType);
          cancel();
        }}
      >
        ✅
      </span>
      <span onClick={cancel}>❌</span>
    </>
  );
}
