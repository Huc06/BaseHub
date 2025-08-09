"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onSubmit: (e: React.FormEvent) => void;
  isValidating: boolean;
  botEnabled: boolean;
  toggleBot: () => void;
};

export default function InputControls({ value, onChange, placeholder, onSubmit, isValidating, botEnabled, toggleBot }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all"
        >
          {isValidating ? 'Checking…' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={toggleBot}
          className={`px-4 py-3 rounded-lg border text-sm transition-colors ${botEnabled ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/10 border-white/20 text-white/80'}`}
        >
          {botEnabled ? 'Bot: ON' : 'Bot: OFF'}
        </button>
      </div>
    </form>
  );
}


