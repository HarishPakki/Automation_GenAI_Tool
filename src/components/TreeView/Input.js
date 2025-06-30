import { useState } from "react";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const styles = {
  fontSize: '20px'
};

export default function Input({ name = "", id, submit, cancel, newType }) {
  const [value, setValue] = useState(name);

  return (
    <div className="new-file">
      <div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
        />
      </div>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          if(value){
            submit(id, value, newType);
            cancel();
          }
        }}
      >
        <CheckOutlinedIcon sx={styles} />
      </div>
      <div onClick={cancel} style={{ cursor: 'pointer' }}><CloseOutlinedIcon sx={styles} /></div>
    </div>
  );
}
