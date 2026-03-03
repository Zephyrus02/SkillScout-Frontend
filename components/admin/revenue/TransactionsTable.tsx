import { transactions, STATUS_CONFIG } from "./data";

export default function TransactionsTable() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-surface-dark">
      <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Recent Transactions
        </h4>
        <button
          type="button"
          className="text-sm font-bold text-primary hover:underline"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {transactions.map((tx) => {
              const cfg = STATUS_CONFIG[tx.status];
              return (
                <tr
                  key={tx.name + tx.date}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {tx.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {tx.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {tx.plan}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded px-2 py-1 text-[10px] font-bold ${cfg.cls}`}
                    >
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
