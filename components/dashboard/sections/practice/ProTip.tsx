export default function ProTip() {
  return (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="flex items-center gap-2 font-bold text-base mb-2">
        <span className="material-icons text-yellow-300">lightbulb</span>
        Pro Tip
      </div>
      <p className="text-sm text-white/90 leading-relaxed">
        For system design questions, start by clarifying requirements and
        constraints before jumping into the architecture. Interviewers value
        structured thinking over rushed solutions.
      </p>
    </div>
  );
}
