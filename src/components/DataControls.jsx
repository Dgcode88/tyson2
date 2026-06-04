import { useRef, useState } from "react";
import styled from "styled-components";
import { LuDownload, LuUpload, LuCheck } from "react-icons/lu";

// Everything the app knows lives in localStorage under the "tyson" prefix. These
// controls let a user carry that record off the device and back — so a cleared
// cache or Safari's storage eviction can't quietly erase 90 days of work.
const PREFIX = "tyson";

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 18px;
  margin-top: 4px;
  padding: 6px 4px 2px;
  color: ${({ theme }) => theme.color.textDim};
  font-size: 12px;
`;

const Note = styled.span`
  letter-spacing: 0.01em;
`;

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.text};
    border-color: ${({ theme }) => theme.color.borderStrong};
    background: ${({ theme }) => theme.color.surfaceHover};
  }
  svg {
    color: ${({ theme }) => theme.color.teal};
  }
`;

function collectRecord() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) data[key] = localStorage.getItem(key);
  }
  return data;
}

export default function DataControls() {
  const fileRef = useRef(null);
  const [restored, setRestored] = useState(false);

  const exportRecord = () => {
    const payload = {
      app: "tyson-90",
      exportedAt: new Date().toISOString(),
      data: collectRecord(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tyson-record.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-importing the same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const data = parsed && parsed.data ? parsed.data : parsed;
        if (!data || typeof data !== "object") throw new Error("shape");
        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith(PREFIX)) {
            localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
          }
        });
        setRestored(true);
        // Reload so every hook re-reads the restored record from storage.
        setTimeout(() => window.location.reload(), 600);
      } catch {
        // eslint-disable-next-line no-alert
        alert("That file couldn't be read as a Tyson record.");
      }
    };
    // A failed read (revoked permission, file moved, provider error) otherwise
    // fires neither onload nor the catch — the user would see nothing at all.
    reader.onerror = () => {
      // eslint-disable-next-line no-alert
      alert("That file couldn't be opened. Try picking it again.");
    };
    reader.readAsText(file);
  };

  return (
    <Footer>
      <Note>Your record lives on this device.</Note>
      <Btn type="button" onClick={exportRecord}>
        <LuDownload size={14} aria-hidden="true" /> Export
      </Btn>
      <Btn type="button" onClick={() => fileRef.current?.click()}>
        {restored ? <LuCheck size={14} aria-hidden="true" /> : <LuUpload size={14} aria-hidden="true" />}
        {restored ? "Restored" : "Restore"}
      </Btn>
      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} />
    </Footer>
  );
}
