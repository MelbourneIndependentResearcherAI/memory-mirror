import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Unified Platform</h1>

      <ul>
        <li><Link to="/memory-mirror">Memory Mirror</Link></li>
        <li><Link to="/carer-hire-ai">CarerHire AI</Link></li>
        <li><Link to="/little-ones-ai">Little Ones AI</Link></li>
        <li><Link to="/fresh-start-ai">Fresh Start AI</Link></li>
      </ul>
    </div>
  );
}
