import { Component } from "react";
import { theme, arenaBg } from "../theme.js";

// Catches a render throw anywhere below it so one bad data shape can't blank the
// whole app to a white screen. It renders OUTSIDE the ThemeProvider (that lives
// inside App, which may be the thing that threw), so styling is inline styles
// built from plain module constants — those need no provider context and stay
// usable even when the styled-components layer is what crashed.
const wrap = {
  position: "fixed",
  inset: 0,
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background: arenaBg,
  color: "#F5F7FA",
  fontFamily: theme.font.body,
  textAlign: "center",
  zIndex: 2000,
};
const titleStyle = {
  margin: "0 0 10px",
  fontFamily: theme.font.brutal,
  fontSize: "clamp(34px, 9vw, 72px)",
  letterSpacing: "0.01em",
  textTransform: "uppercase",
  color: "#EDE7DC",
  textShadow: "0 0 50px rgba(225,29,42,0.5)",
};
const bodyStyle = { margin: "0 0 26px", maxWidth: "34ch", lineHeight: 1.5, color: "#9AA4B2" };
const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px 30px",
  borderRadius: "999px",
  border: "1.5px solid #E11D2A",
  background: "linear-gradient(100deg, rgba(225,29,42,0.18), rgba(225,29,42,0.08))",
  color: "#F5F7FA",
  fontFamily: theme.font.display,
  fontSize: "15px",
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // Surface it for debugging; the user sees the recovery card, not a blank page.
    console.error("App crashed:", error, info?.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={wrap} role="alert">
        <div>
          <h1 style={titleStyle}>The arena went dark</h1>
          <p style={bodyStyle}>
            Something broke mid-round. Your progress is saved — reload and step back in.
          </p>
          <button type="button" style={btnStyle} onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    );
  }
}
