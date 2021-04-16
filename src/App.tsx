import { useState } from "react";
import MultiEmailInput from "./components/MultEmailInput";
import { initailEmails } from "./__mock__/mock";

import "./App.css";

function App() {
  const [emailList, setEmailList] = useState<string[]>([]);

  return (
    <div className="container">
      <div className="selectContainer">
        <MultiEmailInput
          placeholder="Enter email address"
          emails={emailList}
          onChange={(_emails: any) => {
            setEmailList(_emails);
          }}
          suggestions={initailEmails}
          getLabel={(
            email: string,
            index: number,
            removeEmail: (index: number) => void
          ) => (
            <div data-tag key={index}>
              {email}
              <span data-tag-handle onClick={() => removeEmail(index)}>
                ×
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default App;
