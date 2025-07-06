import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function Input({ submit, id, cancel, name = "", newType }) {
  const [value, setValue] = useState(name);

  const handleSubmit = () => {
    if (value.trim() === "") return;
    submit(id, value, newType);
    cancel();
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TextField
        autoFocus
        variant="standard"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={newType ? `New ${newType} name` : "New name"}
        size="small"
        fullWidth
      />
      <IconButton onClick={handleSubmit} size="small">
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={cancel} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );
}